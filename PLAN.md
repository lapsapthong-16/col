# BountyQ Implementation Plan

Status: planning baseline  
Last updated: 2026-09-23  
Primary target: a working Crypto World's Fair hackathon product plus a credible production roadmap  
Network target: Base Sepolia first, capped Base mainnet beta later

## 1. Product definition

BountyQ is a paid human-judgment API for autonomous agents. An agent submits the smallest categorical question blocking its workflow, BountyQ routes it to qualified reviewers, aggregates the answers, returns a structured result, and settles reviewer earnings in USDC on Base.

The product is not a generic freelance marketplace and does not guarantee instant answers or objective truth. It supplies bounded human judgments under a caller-provided budget and deadline.

### Confirmed product decisions

- Plan for both the hackathon implementation and the production path.
- MVP answers are categorical: yes/no/unclear, multiple choice, match/no-match, and condition verification.
- The public demo and initial examples use public or intentionally shareable content.
- Enterprise content may eventually be accepted, but enterprise-grade isolation is not an MVP claim.
- Workers must be KYC-verified.
- The platform sponsors worker withdrawal gas in the initial setup; the requester ultimately funds this through pricing.
- Deadlines are hard assignment cutoffs. At the deadline, return a resolved result if the threshold was met; otherwise return `insufficient_confidence`, release unused funds, and return partial responses only when the caller opted in.
- A requester may cancel for free before the first worker claims a task. After a claim, valid completed work is paid and only unused funds are returned.
- Reviewers are paid for valid good-faith work even when consensus is not reached.
- BountyQ initially provides information, not financial indemnification. A dispute may refund platform fees but not consequential losses.
- Prepaid funding is the primary MVP flow. x402 is a second interface after the core task loop works.
- Reviewer earnings accumulate offchain and become claimable above a threshold.
- Images have no download control in the UI and are served through short-lived URLs, while acknowledging that screenshots cannot be prevented.

### Explicitly unresolved founder decisions

These are not implementation details. They affect legal exposure, contracts, data handling, economics, or initial marketplace liquidity. Do not silently decide them during implementation.

| ID | Decision required | Recommended default if a hackathon deadline forces a choice |
|---|---|---|
| D1 | Initial task domain used to seed qualifications and gold tasks | Public product/listing images and browser-state screenshots |
| D2 | Launch countries for requesters and workers | Closed beta in founder-approved jurisdictions after counsel; no public global launch claim |
| D3 | Exact worker compensation policy wording | Pay every valid, timely, good-faith response; reject only fraud, spam, qualification failure, or expired work |
| D4 | Custody model: contract-held vault or custodial treasury with database balances | Contract-held USDC vault with constrained operator settlement |
| D5 | Contract mutability and governance | Non-upgradeable vault, pause guardian, and Safe multisig roles |
| D6 | Safe owners and signature threshold | 2-of-3 if three independent trusted signers exist; otherwise disclose temporary single-founder control |
| D7 | User identity model | Conventional account plus attached wallets; wallet signatures prove ownership but are not identity |
| D8 | Agent authentication priority | Scoped API keys against prepaid workspace balances, plus a CDP Agentic Wallet reference client |
| D9 | Asset and response retention | Originals deleted 7 days after terminal state; anonymized response/audit data retained 90 days unless a dispute/legal hold applies |
| D10 | Whether anonymized tasks and responses may improve routing/reputation/models | Separate explicit opt-in from requester and worker |
| D11 | Fee percentage, minimum task payout, and minimum withdrawal | Start with a 15% platform fee; derive worker minimum from a target active-hourly rate; set withdrawal minimum after gas testing |
| D12 | Currency presentation | Settle in USDC and show approximate local fiat equivalents |
| D13 | Permission model | Managed marketplace: approved developers and KYC-approved workers |

All unresolved decisions must be recorded in an Architecture Decision Record before mainnet deployment. D1, D3, D4, D5, D7, D8, and D11 must be decided before the corresponding feature is implemented beyond mocks.

## 2. MVP boundaries

### Included

- Developer onboarding, workspace, API keys, wallet funding, balance, and spend policies.
- `inspect`, `match`, and `verify` as typed variants over one categorical task engine.
- Image upload or public image URL, precise question, fixed answer choices, maximum cost, deadline, requested respondent count, and optional partial result.
- Quote, reserve, assign, answer, aggregate, settle, refund, poll, and signed webhook flow.
- KYC-gated worker onboarding and a mobile-first decision session.
- Reviewer qualification, domain-specific reputation, hidden gold tasks, and basic fraud controls.
- Deterministic agreement calculation and adaptive reviewer routing within the authorized budget.
- Base Sepolia USDC funding and worker withdrawal with at least one verifiable onchain transaction.
- Admin tooling for moderation, worker approval, task intervention, disputes, refunds, reconciliation, and settlement.
- One real agent integration using a scoped API key and prepaid balance.
- Optional x402 v2 paid endpoint after the prepaid flow is stable.

### Explicitly deferred

- Free-text and open-ended work.
- Licensed medical, legal, financial, biometric, identity, or high-impact judgments.
- A fully autonomous economic router that decides whether an agent should ask a human at all.
- Guaranteed accuracy or guaranteed response times.
- Public permissionless task creation or worker participation.
- Onchain questions, answers, reputation, consensus, or personally identifiable data.
- Per-answer onchain payments.
- Multi-chain support, fiat payouts, decentralized governance, staking, or a platform token.
- Enterprise private worker pools, customer-managed encryption keys, regional data residency, or formal compliance certifications.

## 3. Architecture

Use a modular monolith. The domain boundaries should be clear in code, but they should deploy as a small number of processes until scale proves otherwise.

```text
Developer / Agent                     Worker / Admin
       |                                    |
       +--------------- HTTPS --------------+
                            |
                    Next.js web app
                            |
                       FastAPI API
       +--------------------+---------------------+
       |                    |                     |
   PostgreSQL          Redis jobs/pubsub     Private object storage
 source of truth       leases + realtime      task assets
       |                    |
       +------ background worker processes -------+
                            |
                Base indexer / settlement worker
                            |
               BountyQVault + USDC
                     on Base Sepolia
```

### Trust boundary

- PostgreSQL is the source of truth for tasks, routing, responses, reputation, pricing, the internal double-entry ledger, and webhook delivery.
- Redis is disposable infrastructure for jobs, leases, rate limits, and realtime notifications. Redis is never the financial source of truth.
- Base holds or settles USDC and enforces signed spending limits, depending on D4.
- BountyQ controls task routing, moderation, consensus computation, disputes, and the settlement operator. It must not be described as trustless or decentralized.
- Answers and assets never go onchain.

## 4. Technology stack

### Repository layout

Use a pnpm workspace for the web and shared TypeScript packages, with the Python API and Foundry contracts in the same repository.

```text
apps/
  web/                 Next.js application
  api/                 FastAPI application
  worker/              Python background workers
packages/
  sdk-ts/              TypeScript API client
  shared/              generated schemas/types where useful
contracts/             Foundry project
infra/                 local compose and deployment configuration
docs/                  API, architecture decisions, security, operations
```

Do not split routing, consensus, billing, identity, or webhooks into separate services for the MVP.

### Frontend

- Next.js App Router with TypeScript.
- Tailwind CSS for styling.
- React Hook Form plus Zod for forms and client validation.
- TanStack Query for server state.
- RainbowKit for human wallet connection UI.
- wagmi for wallet and contract React hooks.
- viem for typed EVM clients, signatures, receipts, and contract calls.
- Server-Sent Events for task status and worker-feed updates. Use WebSockets only if bidirectional realtime behavior is later required.
- Accessible, mobile-first worker UI with keyboard, touch, and reduced-motion support.

RainbowKit's current installation uses RainbowKit, wagmi, viem, and TanStack Query. Obtain a WalletConnect Cloud project ID and configure authenticated Base RPC transports rather than relying on rate-limited public RPCs: <https://rainbowkit.com/docs/installation>.

### Backend

- Python 3.13.
- FastAPI with Pydantic v2.
- SQLAlchemy 2 and Alembic.
- PostgreSQL 17.
- Redis for queues, leases, caching, pub/sub, and rate limits.
- Dramatiq with Redis for background work. Do not introduce Temporal until workflows demonstrably need its operational complexity.
- S3-compatible private object storage with encryption and signed URLs.
- OpenAPI generated by FastAPI; generate the TypeScript SDK from this schema.
- OpenTelemetry-compatible structured logs and traces plus Sentry for errors.

### Smart contracts and Base

- Solidity 0.8.x with an exact compiler version pinned at implementation time.
- Foundry for build, tests, scripts, local Anvil, deployment, and verification.
- OpenZeppelin `SafeERC20`, `ReentrancyGuard`, `Pausable`, and `AccessControl` only where the selected contract design requires them.
- Canonical native USDC only. Use six-decimal integer arithmetic and never floating-point values.
- Base Sepolia chain ID `84532`; Base mainnet chain ID `8453`.
- Confirm official USDC addresses from Circle/Base documentation at deployment time and store them in environment-specific deployment manifests.
- Safe multisig for administrative roles once D6 is decided.
- Slither plus Foundry unit, fuzz, and invariant tests.

### Base products

- Base network for USDC custody and settlement.
- Base Account or Coinbase Wallet through RainbowKit for human funding and withdrawal UX.
- CDP Agentic Wallet for the reference autonomous-agent integration if D8 adopts the recommendation.
- Coinbase paymaster only if sponsored worker claims are implemented and tested; do not assume sponsorship without a configured budget and allowlist.
- x402 v2 and the CDP facilitator for an optional fixed-price or quoted agent endpoint after the prepaid flow works.
- Bazaar discovery only after the x402 endpoint has stable schemas and production-safe content controls.

Official references:

- Base agent infrastructure: <https://www.base.org/agents>
- x402 seller integration: <https://docs.cdp.coinbase.com/x402/seller/quickstart>
- x402 verification and schemes: <https://docs.cdp.coinbase.com/api-reference/v2/rest-api/x402-facilitator/verify-payment>
- x402 Bazaar MCP: <https://docs.cdp.coinbase.com/api-reference/v2/rest-api/x402-facilitator/bazaar-mcp-server>
- CDP Agentic Wallet: <https://docs.cdp.coinbase.com/agentic-wallet/cli/quickstart>

## 5. Wallet connectors and authentication

### RainbowKit connector configuration

Expose a curated wallet list rather than every connector:

- Coinbase Wallet / Base Account.
- WalletConnect.
- Injected EIP-1193 wallets, including MetaMask and browser wallets.

Configure only Base Sepolia during the hackathon. Add Base mainnet behind an environment flag after the mainnet release gates pass. The application must handle disconnected wallet, unsupported chain, account change, chain change, insufficient ETH for unsponsored actions, insufficient USDC, rejected signature, replacement transaction, reverted transaction, and RPC timeout.

### Human authentication

Final design is gated by D7. Recommended flow:

1. User signs in with email/passkey.
2. Server creates a short-lived wallet-link nonce.
3. User signs a SIWE message containing domain, URI, chain ID, nonce, issued time, and expiry.
4. Server verifies the signature and attaches the wallet to the account.
5. Authentication continues through secure, HTTP-only, same-site cookies.
6. Changing wallet or chain invalidates pending wallet operations but does not silently change the signed-in account.

Workers cannot enter the task feed until KYC status is approved. Wallet connection alone is not proof of personhood.

### Agent authentication

Final priority is gated by D8. Recommended initial flow:

- A developer creates a workspace and scoped API key.
- API keys are shown once, stored as hashes, rotatable, expirable, and restricted by environment and scopes.
- Workspace policies cap per-task spending, daily spending, allowed primitives, allowed domains, and permitted callback URLs.
- A reference CDP Agentic Wallet client funds the workspace and calls the API.
- Direct EIP-712 task authorization can be added for agents that do not trust an API key with spending authority.

Never automate a browser wallet for an autonomous agent or store raw customer private keys in the backend.

## 6. Task lifecycle

Use one explicit state machine:

```text
DRAFT
  -> QUOTED
  -> FUNDED
  -> QUEUED
  -> COLLECTING
  -> RESOLVED

From eligible nonterminal states:
  -> CANCELLED
  -> EXPIRED
  -> FAILED
  -> REVIEW_REQUIRED

Payment substates:
  UNRESERVED -> RESERVED -> CHARGED
                         -> RELEASED
```

Only the service layer may perform transitions. Every transition writes an audit event in the same database transaction.

### Creation flow

1. Validate API key, workspace policy, primitive, categorical schema, asset count/type/size, maximum cost, and deadline.
2. Require `Idempotency-Key`; return the original task for an exact retry and reject conflicting payload reuse.
3. Strip image metadata, decode safely, scan for malware, screen prohibited content, and create redacted derivative assets.
4. Generate an immutable price snapshot and estimated completion window.
5. Atomically reserve the maximum authorized amount.
6. Persist the task and a transactional outbox event.
7. Return `202 Accepted` with task ID, status URL, quoted maximum, and webhook event type.

### Assignment flow

1. Filter workers by approved/KYC state, domain qualification, locale if required, device/risk status, task history, and conflict rules.
2. Randomize answer order and eligible worker selection.
3. Create a short assignment lease atomically so two workers cannot claim the same slot.
4. Never show peer answers before submission.
5. Requeue expired leases; repeated abandonment reduces queue priority.
6. Prevent one worker, wallet, device, household, or correlated payment graph from contributing more than one response to a task.

### Completion flow

1. Accept one immutable response per assignment before lease expiry.
2. Record schema version, asset version, latency, qualification state, and risk signals.
3. Run consensus after every eligible response.
4. If the threshold is unmet and budget/time permit, add reviewers without exceeding `max_cost`.
5. Resolve, return `insufficient_confidence`, or expire according to the caller's deadline policy.
6. Charge actual accepted work and fee, release unused reservation, credit reviewer earnings, and write the final result in one transaction.
7. Deliver a signed webhook; polling remains the authoritative fallback.

## 7. API surface

Prefix public endpoints with `/v1`.

### Agent API

- `POST /v1/tasks/inspect`
- `POST /v1/tasks/match`
- `POST /v1/tasks/verify`
- `POST /v1/tasks/quote`
- `GET /v1/tasks/{task_id}`
- `POST /v1/tasks/{task_id}/cancel`
- `GET /v1/tasks/{task_id}/responses` only when workspace policy permits raw-response access
- `POST /v1/uploads` to obtain a signed upload URL
- `GET /v1/balance`
- `GET /v1/transactions`
- `POST /v1/webhooks`
- `POST /v1/webhooks/{id}/rotate-secret`
- `POST /v1/webhook-deliveries/{id}/replay`

### Worker API

- `GET /v1/worker/me`
- `POST /v1/worker/onboarding`
- `GET /v1/worker/next-task`
- `POST /v1/worker/assignments/{id}/answer`
- `POST /v1/worker/assignments/{id}/skip`
- `POST /v1/worker/assignments/{id}/report`
- `GET /v1/worker/earnings`
- `GET /v1/worker/history`
- `GET /v1/worker/reputation`
- `POST /v1/worker/withdrawals`

### Admin API

- Task search, quarantine, replay, cancel, and manual review.
- Worker KYC review, suspend, reinstate, qualify, and audit.
- Moderation queue and prohibited-content actions.
- Dispute, refund, and appeal resolution.
- Settlement batch creation, approval, submission, and reconciliation.
- Pricing/supply controls and immutable audit history.

### Example task request

```json
{
  "asset_ids": ["asset_01..."],
  "question": "Is there visible damage to the phone screen?",
  "answers": ["yes", "no", "unclear"],
  "respondents": 3,
  "max_cost_usdc": "0.50",
  "deadline": "2026-09-23T12:00:00Z",
  "return_partial": false,
  "metadata": {"listing_id": "listing_123"}
}
```

### Example terminal result

```json
{
  "task_id": "task_01...",
  "status": "resolved",
  "answer": "no",
  "agreement_score": 0.91,
  "confidence_status": "experimental",
  "eligible_responses": 3,
  "cost_usdc": "0.14",
  "reserved_usdc": "0.50",
  "released_usdc": "0.36",
  "completed_at": "2026-09-23T11:43:20Z",
  "audit_id": "audit_01..."
}
```

Do not return a value called statistically calibrated `confidence` until evaluation against sufficient hidden gold and observed outcome data supports that interpretation.

## 8. Consensus and reviewer reputation

### MVP consensus

- Minimum three independent eligible responses by default.
- Treat `unclear` as a real answer, not an abstention that is silently discarded.
- Weight votes by smoothed domain reliability only after a minimum evidence count. New reviewers start near the population prior.
- Require a configured top-answer share and winning margin.
- Add reviewers up to the requested maximum only when remaining budget and deadline permit.
- If the threshold is not reached, return `insufficient_confidence`; never fabricate certainty.
- Store the consensus algorithm name and version on every result.

### Reputation inputs

- Hidden gold-task accuracy.
- Later-known outcome labels supplied through a controlled feedback flow.
- Random manual audits.
- Consensus agreement as weak evidence only.
- Response validity, latency, abandon rate, and fraud signals.

Maintain separate domain scores. Apply Bayesian shrinkage, minimum samples, and stale-score decay. Do not equate majority agreement with truth, and do not let requester dissatisfaction directly dock worker pay.

## 9. Pricing and accounting

### Pricing

```text
worker payout = predicted active seconds
              x target active-hourly rate
              x difficulty factor
              x supply factor
              x urgency factor

requester quote = expected total worker payouts
                + platform fee
                + sponsored gas allowance
                + fraud/dispute reserve allowance
```

The exact values are gated by D11. Store every quote as an immutable versioned snapshot. Dynamic repricing may increase reward only within the reserved maximum. Never silently reduce reviewers or quality requirements to fit the budget.

### Internal ledger

Use an immutable double-entry ledger. Every monetary event must balance in USDC atomic units:

- agent available balance;
- agent reserved balance;
- worker provisional earnings;
- worker claimable earnings;
- protocol fee balance;
- dispute/refund reserve;
- withdrawal payable;
- onchain treasury/vault clearing.

No code path may directly update a cached balance. Balances are derived from or transactionally maintained alongside balanced ledger entries. Run continuous reconciliation against onchain assets and halt new paid tasks if liabilities exceed verified assets.

## 10. Smart-contract plan

The final contract implementation is gated by D4 and D5. The recommended design is one non-upgradeable `BountyQVault` contract. Do not add onchain reputation, task content, pricing logic, governance tokens, or per-task NFTs.

### `BountyQVault`

Responsibilities:

- Accept canonical USDC deposits for an agent/payer.
- Track available and locked payer balances.
- Accept EIP-712 task spending authorization containing payer, `taskId`, maximum amount, expiry, nonce, chain ID, and verifying contract.
- Allow an authorized settlement operator to settle an actual charge no greater than the signed maximum.
- Allocate settled value among worker claimable balances and protocol fees; allocations must sum exactly to the charge.
- Unlock unused authorization on settlement, cancellation, or expiry.
- Prevent duplicate task settlement and nonce replay.
- Let workers claim accumulated USDC, or permit a sponsored `claimFor` path.
- Let payers withdraw unlocked USDC.
- Enforce fee and batch-value caps.
- Support emergency pause without allowing administrators to seize user USDC.
- Allow rescue of accidentally sent non-USDC assets only.
- Emit complete deposit, lock, unlock, settlement, claim, withdrawal, and pause events.

### Roles

- `DEFAULT_ADMIN_ROLE`: Safe multisig, gated by D6.
- `SETTLER_ROLE`: limited hot key or service account with per-batch/value controls.
- `PAUSER_ROLE`: separate guardian capable only of stopping sensitive operations.

### Required invariants

- Contract USDC assets are always at least the sum of payer available, payer locked, worker claimable, and protocol accrued balances.
- A task cannot settle twice.
- Actual charge cannot exceed signed maximum.
- Allocations plus protocol fee equal actual charge exactly.
- A nonce cannot be replayed across tasks, chains, contracts, or expiries.
- A worker cannot claim the same balance twice.
- Paused operations cannot move funds except explicitly allowed safe withdrawals, depending on the final emergency policy.
- Admins cannot sweep canonical USDC.

### Hackathon fallback if D4 remains unresolved

Implement a clearly labeled custodial demo:

- One treasury address receives Base Sepolia USDC.
- PostgreSQL maintains the balanced internal ledger.
- Withdrawals are submitted from a settlement wallet with manual approval.
- The UI and documentation label balances as custodial claims, not trustless vault balances.
- The same ledger and API interfaces remain usable when the vault replaces the treasury.

## 11. x402 plan

x402 is not the primary task-accounting system.

### Phase-one x402 scope

- Expose one paid discovery/demo endpoint after prepaid funding works.
- Use x402 v2, Base Sepolia CAIP-2 network `eip155:84532`, canonical USDC, and CDP facilitator verification/settlement.
- Offer a fixed-price quote or task-creation fee that has explicit expiration/refund semantics.
- Attach a unique payment reference to the idempotent task request.
- Reject any request that is also charging the prepaid balance; one task has exactly one payment source.
- Publish an MCP tool only after HTTP semantics and schemas are stable.

Do not use one x402 exact payment as the entire dynamic task budget unless the product explicitly defines how unused funds, deadline expiry, additional reviewers, and refunds work.

## 12. Data model

Minimum tables:

- `users`, `workspaces`, `memberships`, `sessions`.
- `wallets`, `wallet_link_nonces`, `kyc_profiles`.
- `api_keys`, `spend_policies`.
- `tasks`, `task_assets`, `quotes`, `price_snapshots`.
- `assignments`, `responses`, `consensus_results`.
- `worker_profiles`, `qualifications`, `domain_reputations`, `gold_tasks`, `gold_results`.
- `ledger_accounts`, `ledger_transactions`, `ledger_entries`, `reservations`, `earnings`.
- `withdrawals`, `settlement_batches`, `chain_transactions`, `chain_cursors`.
- `webhook_endpoints`, `webhook_deliveries`.
- `moderation_cases`, `reports`, `disputes`.
- `audit_events`, `outbox_events`, `inbox_events`.

Use UUIDv7 or ULID public identifiers, UTC timestamps, explicit status enums, monetary integers in USDC atomic units, immutable ledger/audit rows, row-level tenant scoping in every query, and optimistic version columns on mutable state machines.

## 13. Background jobs and reliability

Jobs must be idempotent and safe under at-least-once execution:

- asset scan, redaction, and deletion;
- task routing and assignment;
- lease expiration and requeue;
- consensus evaluation;
- deadline expiration;
- dynamic repricing within authorization;
- webhook signing, retry, and dead-letter handling;
- chain event indexing with confirmation policy and reorg replay;
- worker earning finalization;
- withdrawal batching and submission;
- ledger/onchain reconciliation;
- gold-task injection and reputation recomputation;
- moderation and fraud review queues.

Use a transactional outbox for database-to-job/webhook publication and an inbox/event ID for deduplication. SSE and Redis notifications are presentation aids; clients recover from disconnects by reading PostgreSQL-backed endpoints.

## 14. Frontend pages

### Public

- `/` — product explanation and live demo entry.
- `/how-it-works` — agent, reviewer, consensus, and payment flow.
- `/pricing` — quote model and example costs without unsupported guarantees.
- `/docs` — API/SDK quickstart.
- `/status` — service and network status.
- `/privacy`, `/terms`, `/acceptable-use`, `/worker-agreement`.

### Developer application

- `/app/overview` — balance, open tasks, spend, and completion metrics.
- `/app/create` — interactive `inspect`/`match`/`verify` playground with redaction preview.
- `/app/tasks` — filters and task list.
- `/app/tasks/[id]` — evidence, timeline, answers when permitted, result, accounting, webhook and audit record.
- `/app/billing` — connect wallet, deposit, available/reserved balance, withdrawal/refund, transaction history.
- `/app/policies` — per-task/daily caps, primitives, domains, deadlines, and callbacks.
- `/app/api-keys` — create, scope, rotate, revoke.
- `/app/webhooks` — endpoints, secret rotation, delivery logs, replay.
- `/app/team` — memberships and roles.
- `/app/settings` — retention, consent, notifications, and workspace settings.

### Worker application

- `/work/onboarding` — account, KYC, wallet, eligibility, consent, tutorial and qualification.
- `/work/session` — one task at a time, reward shown before acceptance, answer/skip/report controls.
- `/work/earnings` — provisional, claimable, paid, withdrawal threshold, sponsored-gas status.
- `/work/history` — completed, expired, rejected, appealed.
- `/work/reputation` — domain scores, sample sizes, qualifications, limitations.
- `/work/settings` — wallet, notifications, domains, availability and deletion requests.

### Operations

- `/admin/tasks` — search, quarantine, intervention and replay.
- `/admin/workers` — KYC status, qualifications, risk, suspension and appeals.
- `/admin/moderation` — reported/prohibited content.
- `/admin/disputes` — refunds and worker appeals.
- `/admin/settlements` — batches, claims, confirmations and failures.
- `/admin/reconciliation` — assets versus ledger liabilities and drift alerts.
- `/admin/pricing` — supply, queue depth and versioned price configuration.
- `/admin/audit` — immutable administrative actions.

### Mandatory UI states

- Disconnected wallet, wrong chain, insufficient USDC, insufficient gas, and signature rejection.
- Deposit pending, confirmed, failed, replaced, and reorged.
- Task quoted, queued, claimed, collecting, resolved, insufficient confidence, expired, cancelled, disputed, and refunded.
- Worker feed empty, task lease expiring, stale/reconnected session, unsafe-content report, and KYC blocked.
- Earnings provisional, claimable, withdrawal pending, confirmed, and failed.
- Webhook pending, delivered, retrying, and dead-lettered.

## 15. Privacy, safety, fraud, and moderation

### Prohibited MVP task classes

- Faces, biometrics, identity documents, credentials, payment details, or authentication secrets.
- Medical, legal, financial, employment, housing, insurance, or other high-impact decisions.
- Sexual content, minors, illegal goods, weapons, surveillance, or doxxing.
- CAPTCHAs, anti-bot circumvention, terms-of-service evasion, or unauthorized account access.
- Private communications or confidential enterprise information until the enterprise architecture exists.

### Required controls

- Developer attestation that submitted content is lawful and authorized.
- MIME allowlist, size/pixel limits, safe decoding, metadata removal, malware scanning, and decompression-bomb protection.
- Automated PII/secrets/NSFW screening and quarantine on uncertainty.
- Encrypted private storage and short-lived signed URLs.
- No public IPFS or permanent public asset URLs.
- Inert rendering of user text and images; never execute submitted HTML, scripts, links, or agent instructions.
- Worker report/skip controls and an emergency task kill switch.
- Rate limits by API key, workspace, wallet, account, device, and IP.
- Blind independent answers, randomized choices, duplicate-image detection, hidden gold tasks, velocity limits, and correlated-vote detection.
- Delayed or limited withdrawals for new/high-risk workers.
- Tenant-isolation and IDOR tests on every resource class.

Retention behavior remains gated by D9 and reuse by D10.

## 16. Webhooks and integrations

- Sign webhook bodies with HMAC-SHA256 using a per-endpoint secret.
- Include event ID, delivery timestamp, task ID, event type, and schema version.
- Reject replay outside the documented timestamp window.
- Retry with exponential backoff and jitter; cap attempts and move failures to a visible dead-letter state.
- Provide secret rotation with overlap and a manual replay action.
- Events: `task.queued`, `task.collecting`, `task.resolved`, `task.insufficient_confidence`, `task.expired`, `task.cancelled`, `task.refunded`, and `withdrawal.updated`.
- Generate TypeScript and Python SDKs only after the OpenAPI contract stabilizes; before then, publish copy-paste HTTP examples.

## 17. Testing strategy

### Backend unit and property tests

- Every allowed and forbidden task transition.
- Idempotent create/cancel/answer/settle/webhook behavior.
- Quote bounds, reservation, charge, release, and fee rounding.
- Consensus ties, unclear answers, insufficient threshold, adaptive reviewers, deadlines, and partial-result policy.
- Reputation priors, minimum samples, decay, and gold-task updates.
- Ledger entries always balance and cannot create funds.

### Contract tests

- Deposit, lock, settle, unlock, withdraw, claim, and sponsored claim.
- EIP-712 domain, nonce, expiry, task ID, chain, contract, and maximum-charge binding.
- Double settlement, double claim, replay, overcharge, incorrect allocations, and unauthorized role attempts.
- Paused-state behavior, fee caps, value caps, rounding, six-decimal amounts, and reentrancy.
- Fuzz/property tests for accounting conservation.
- Invariant: contract assets cover all recorded liabilities.

### Integration tests

- API creation through three worker answers, consensus, webhook, ledger movement, and withdrawal.
- Assignment expiration and requeue.
- Cancellation before and after claim.
- No-consensus deadline and correct worker payment/refund.
- Duplicate job delivery and webhook retry.
- Moderation rejection and asset deletion.
- Base event confirmation, indexer restart, duplicate logs, and simulated reorg.

### End-to-end tests

- Developer signs in, connects through RainbowKit, switches to Base Sepolia, deposits USDC, creates a task, and sees the reservation.
- Three distinct approved workers answer independently.
- Agent receives the final JSON and continues a demo workflow.
- Worker crosses the threshold and completes a sponsored withdrawal.
- Admin resolves one report or dispute.
- Explorer links match the displayed funding and settlement events.

### Security and operational tests

- Tenant isolation, authorization bypass, webhook replay, API-key scope, session fixation, and wallet-link replay.
- XSS, malicious SVG, image bombs, prompt injection, unsafe URL fetches, SSRF, and file-type confusion.
- Sybil/collusion simulations and withdrawal risk controls.
- Burst task creation, hot worker queue, queue restart, Redis loss, database failover, webhook outage, and RPC outage.
- Slither and dependency/secret scans on every release.

## 18. Deployment and environments

### Local

- Docker Compose for PostgreSQL, Redis, object-storage emulator, API, workers, and web.
- Anvil with mock USDC and the selected vault contract.
- Seed command creates one developer, three approved workers, gold tasks, balances, and the used-phone demo.

### Preview/test

- Vercel for Next.js.
- Managed container host for FastAPI and workers.
- Managed PostgreSQL with point-in-time recovery.
- Managed Redis.
- Private S3-compatible bucket.
- Base Sepolia authenticated RPC with a fallback provider.
- Separate secrets, database, bucket, wallets, contracts, and webhook domains per environment.

Vendor selection can remain replaceable until implementation; avoid abstractions beyond environment configuration.

### Mainnet beta release gates

- D2–D13 resolved and documented.
- Legal review of custody, KYC/AML/sanctions, worker classification, taxes, terms, and launch jurisdictions.
- External smart-contract/security review.
- Contract source verified and deployment manifest published.
- Multisig and pause guardian operational.
- Reconciliation proves no unexplained drift through a sustained Sepolia test period.
- Low per-task, per-workspace, per-batch, per-day, and total-value caps.
- Manual settlement approval initially.
- Incident response, key rotation, backup/restore, refund, and pause runbooks tested.
- Status page and monitoring alerts operational.

## 19. Observability and operating metrics

Track:

- Task creation, rejection, queue depth, and active leases.
- Time to first claim and completion p50/p95 by domain.
- Deadline-miss, insufficient-confidence, cancellation, dispute, and refund rates.
- Agreement distribution and accuracy on hidden gold tasks.
- Effective reviewer earnings per active minute and supply utilization.
- Reviewer abandon, invalid response, fraud, and correlated-vote rates.
- API latency/errors, job failures, webhook delivery success, SSE reconnects, and object-storage failures.
- Available, reserved, claimable, protocol, and onchain balances plus reconciliation drift.
- Deposit and withdrawal confirmation time and failed/replaced/reorged transactions.

Alert immediately on ledger imbalance, assets below liabilities, repeated settlement failure, elevated moderation volume, unusual withdrawal graphs, leaked secrets, or privileged-role changes.

## 20. Implementation phases

### Phase 0 — decisions and repository foundation

- Resolve D1, D3, D4, D5, D7, D8, and D11 or explicitly adopt their temporary hackathon defaults.
- Add architecture decision records for custody, identity, worker compensation, retention, and x402 scope.
- Scaffold workspace, local services, linting, formatting, type checking, migrations, test runners, CI, and `.env.example`.
- Create threat model and data-flow diagram before accepting uploads or funds.

Exit: fresh clone boots locally and CI passes.

### Phase 1 — offchain vertical slice

- Implement accounts/workspaces/API keys.
- Implement signed uploads, moderation placeholder, categorical task creation, state machine, reservations, assignments, responses, consensus, polling, and webhooks.
- Implement worker onboarding mock approval, session feed, earnings, and basic admin task controls.
- Use mocked USDC ledger entries; no contract dependency.

Exit: one developer and three workers complete the full task loop locally with balanced accounting.

### Phase 2 — Base funding and settlement

- Implement the chosen D4 contract or documented custodial fallback.
- Add RainbowKit/wagmi/viem with Coinbase Wallet, WalletConnect, and injected connectors.
- Add Base Sepolia funding, confirmation indexing, balances, reservations, settlement, sponsored worker claim, and explorer links.
- Add reconciliation and circuit breaker.

Exit: a fresh Base Sepolia wallet funds a task and a worker receives real testnet USDC without manual database edits.

### Phase 3 — trust and marketplace controls

- Integrate KYC provider behind a small adapter.
- Add qualifications, gold tasks, domain reputation, moderation queues, reports, appeals, fraud signals, and withdrawal holds.
- Add retention deletion jobs and consent records.
- Finish admin reconciliation, settlement, worker, moderation, and dispute pages.

Exit: only approved workers can answer, unsafe content can be stopped, and every money/admin action is auditable.

### Phase 4 — developer polish and x402

- Stabilize OpenAPI and publish TypeScript/Python clients.
- Add docs, playground, webhook replay, spend policies, and agent demo.
- Add the optional x402 v2 route with a single-source-of-payment invariant.
- Add MCP publication only if the HTTP route is stable and fully tested.

Exit: an external developer can fund, integrate, submit, wait by webhook, and inspect accounting from documentation alone.

### Phase 5 — hackathon hardening and submission

- Run at least 25 real tasks with at least five external reviewers and three external agent developers.
- Measure completion time, agreement, unresolved rate, cost, worker active earnings, and ledger reconciliation.
- Freeze scope, conduct security review, verify contracts, seed clean demo accounts, and record the complete used-phone workflow.
- Replace unsupported claims in README/SUBMISSION with measured results.

Exit: every item in `SUBMISSION.md`'s submission gate is true.

### Phase 6 — production roadmap

- Resolve all remaining decisions and legal launch gates.
- Run capped mainnet closed beta with manual settlement approval.
- Add automated batches only after sustained reconciliation history.
- Calibrate result confidence against sufficient gold/outcome data.
- Add enterprise isolation, specialist pools, additional modalities, economic route recommendation, and more jurisdictions only in response to validated demand.

## 21. Hackathon critical path

If time is constrained, build in this order:

1. Task state machine and balanced internal ledger.
2. Worker feed and three-answer categorical consensus.
3. Agent polling/webhook result.
4. Base Sepolia deposit and sponsored worker withdrawal.
5. Wallet UX and explorer proof.
6. KYC-approved seed workers, moderation, and admin intervention.
7. Reference agent demo.
8. x402 only after everything above is reliable.

Do not sacrifice payment invariants, idempotency, privacy controls, or truthful claims to add extra task types, chains, dashboards, or animations.

## 22. Definition of done

The MVP is complete when:

- A developer creates a workspace, obtains a scoped API key, connects a supported wallet, and funds USDC on Base Sepolia.
- An agent submits a valid categorical image judgment with maximum cost and deadline.
- The system reserves funds exactly once and routes the task only to eligible KYC-approved workers.
- At least three independent workers answer without seeing peer answers.
- The system resolves or returns `insufficient_confidence` according to documented deterministic rules.
- Valid workers are credited even when no consensus is reached.
- The agent receives the terminal structured result through polling and a signed webhook.
- Actual charges, released reservation, worker earnings, platform fees, and sponsored gas reconcile exactly.
- A worker completes a sponsored USDC withdrawal and the UI links to the Base explorer transaction.
- Duplicate requests, jobs, webhooks, settlements, and claims do not duplicate tasks or money.
- Unsafe content can be rejected or quarantined and assets expire according to policy.
- Admin actions, financial changes, contract events, and user-visible state transitions are auditable.
- Automated tests cover state transitions, consensus edge cases, ledger conservation, contract invariants, authorization, uploads, and the complete end-to-end flow.
- Documentation clearly states custody, operator powers, experimental confidence, content limits, deadline behavior, refund behavior, and the difference between offchain orchestration and onchain settlement.

