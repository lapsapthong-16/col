# BountyQ MVP Implementation Plan

## 1. Goal

Build a focused demo of **BountyQ**, a human-answer layer for autonomous agents.

An agent submits a small, categorical question when it cannot safely continue. BountyQ collects independent human answers, applies a simple consensus rule, and returns a structured result that the agent can act on.

The MVP should prove one idea clearly:

> An autonomous agent can buy a fast human judgment for a few cents without integrating a marketplace, hiring workflow, or custom smart contract.

The main demo is a shopping agent. Additional browser, marketing, and marketplace-monitoring requests are hardcoded to show that the same primitive generalizes.

## 2. MVP Decisions

### Included

- Next.js App Router, React, TypeScript, and Tailwind CSS
- A responsive web demo with a worker view and agent-facing request view
- RainbowKit wallet connection in the global header
- Base Sepolia as the demo network
- USDC-denominated fixed prices
- An x402-shaped payment flow, with real x402 support when configured
- Multiple hardcoded request categories
- One polished, deterministic shopping-agent walkthrough
- Three independent human answers per bounty
- Categorical answers only
- A strict-majority consensus rule
- Local deterministic state for repeatable judging

### Explicitly excluded from this MVP

- Custom smart contracts or escrow
- A database, Redis, queues, or background workers
- Production authentication or agent API keys
- Real worker onboarding, KYC, reputation, or fraud prevention
- Dynamic or difficulty-based pricing
- Automated worker payouts
- Refunds and disputes
- Private-media infrastructure
- Multi-chain support
- A production SLA, including any promise of a 30-second response

These exclusions are deliberate. The MVP validates the interaction and payment primitive before building marketplace infrastructure.

## 3. Primary Demo Story

### Shopping agent fallback

1. A shopping agent is evaluating a skincare listing.
2. It finds a product photo whose expiry label is ambiguous: `2027` or `2022`.
3. The agent creates a BountyQ request:
   - Question: “Does this product appear to expire in 2027?”
   - Choices: `Yes`, `No`, `Unclear`
   - Required answers: `3`
4. The request displays its fixed cost before payment.
5. The agent pays using x402 on Base Sepolia, or uses an explicitly labelled demo-payment fallback.
6. The UI simulates the request entering the worker queue.
7. Three seeded reviewers answer: `Yes`, `Yes`, `Unclear`.
8. BountyQ returns a structured result with `Yes`, vote counts, and agreement.
9. The shopping agent continues and selects the listing.

The flow should take 60–90 seconds to present. It must not rely on timing luck, external reviewers, or hidden manual operations.

## 4. Hardcoded Demo Scenarios

All scenarios use the same request and result schema. Only the shopping scenario needs a fully animated end-to-end presentation.

| ID | Category | Agent question | Choices | Seeded outcome |
| --- | --- | --- | --- | --- |
| `shopping-expiry` | Shopping | Does this product appear to expire in 2027? | Yes / No / Unclear | Yes, Yes, Unclear → Yes |
| `browser-checkout` | Browser | Does this screen confirm that checkout succeeded? | Yes / No / Unclear | Yes, Yes, Yes → Yes |
| `marketing-product-visible` | Content | Is the product clearly visible in this video frame? | Yes / No / Unclear | Yes, No, Unclear → Unresolved |
| `marketplace-variant` | Monitoring | Is this listing the same product variant as the reference? | Same / Different / Unclear | Same, Same, Different → Same |

Requests must be selected by a known `scenarioId`. The demo API must reject arbitrary prompts so the hardcoded scope stays honest and secure.

## 5. Product Rules

### Request shape

Each bounty contains:

- `id`
- `scenarioId`
- `category`
- `title`
- `question`
- `context`
- `media`
- `choices`
- `requiredAnswers`
- `priceUsdcMicros`
- `status`
- `answers`
- `result`
- `createdAt`

Use integer micro-USDC values everywhere. Do not calculate currency using floating-point numbers.

### State machine

```text
draft
  → awaiting_payment
  → queued
  → collecting
  → resolved | unresolved
```

State changes are driven by deterministic demo actions, not timers alone. Animation delays may make transitions readable, but they must not be the source of truth.

### Consensus

- Collect exactly three answers in the MVP.
- `Unclear` is a valid worker response and is included in vote counts.
- A result resolves only when one non-unclear choice has a strict majority of all required answers.
- Otherwise, return `unresolved`.
- Report `agreement = winningVotes / totalAnswers`.
- Call this value **agreement**, not confidence; BountyQ has not validated that it represents statistical confidence.

Examples:

- `Yes, Yes, Unclear` → resolved as `Yes`, agreement `0.67`
- `Yes, No, Unclear` → unresolved
- `Unclear, Unclear, Yes` → unresolved

### Pricing

Use one fixed price for every demo request:

| Item | Amount |
| --- | ---: |
| 3 reviewer answers | $0.15 USDC |
| BountyQ fee | $0.03 USDC |
| Total | $0.18 USDC |

Do not estimate task difficulty. BountyQ accepts only short categorical judgments in the MVP, so fixed pricing is clearer and easier to demo.

## 6. Technical Stack

### Application

- Next.js App Router
- React
- TypeScript with strict mode
- Tailwind CSS
- Route Handlers for the demo API
- React context plus `useReducer` for shared demo state
- `localStorage` only for optional demo persistence and reset

### Base and wallet integration

- Base Sepolia
- RainbowKit for the connect-wallet UI
- wagmi for wallet state and React hooks
- viem for chain configuration and transaction utilities
- USDC for payment denomination
- x402 for the agent-payment request when real payment mode is enabled

No custom contract is needed. Payment goes directly to a configured BountyQ treasury address. Accounting, escrow, and reviewer payout splitting are simulated in this version.

### Testing

- Vitest for consensus, pricing, validation, and state transitions
- React Testing Library only where component behavior adds value
- One Playwright happy-path test for the shopping demo if browser-test setup remains lightweight

Do not add an ORM, database client, global state library, form library, component framework, Python service, or separate backend.

## 7. Application Pages

### `/` — Landing page

- One-sentence product explanation
- “Run shopping-agent demo” primary CTA
- Compact “How it works” sequence: ask → pay → humans answer → continue
- Example categories
- Clear statement that the current product is a demo

### `/demo/shopping` — Main demo

- Shopping-agent activity panel
- Product/listing context and ambiguous label image
- Bounty request preview
- Fixed cost breakdown
- Payment state
- Human-answer collection visualization
- Consensus result
- Final “agent continued” state
- Reset demo control

This is the highest-priority page and should receive most of the product polish.

### `/demo/requests` — Other request types

- Cards for all four seeded scenarios
- Category, question, price, choices, and sample outcome
- Selecting a card opens a shared request-detail panel
- Make it clear these are representative hardcoded examples

### `/work` — Human worker demo

- Seeded queue of available requests
- Request detail with context/media
- Large categorical answer buttons
- Submit confirmation
- No wallet payout claim or KYC UI in this MVP

### `/earnings` — Simulated worker earnings

- Seeded completed answers
- Simulated USDC earned
- A clear “Demo data” label
- Short note that production payouts and KYC are future work

### `/docs` — Agent integration explanation

- Request schema
- Example x402 interaction
- Response schema
- Consensus rules
- Demo limitations
- Copyable request and response examples

## 8. Shared UI

### Global header

- BountyQ wordmark
- Demo, Work, and Docs navigation
- Base Sepolia network indicator
- RainbowKit `ConnectButton`

The wallet connector belongs in the header on every page. Connecting a wallet is optional for browsing, but required for real-payment mode.

### Core components

- `AppHeader`
- `ScenarioCard`
- `RequestPanel`
- `PriceBreakdown`
- `PaymentStep`
- `AnswerCollector`
- `ConsensusResult`
- `AgentTimeline`
- `DemoBadge`
- `ResetDemoButton`

Keep components concrete. Do not build a design-system package or speculative generic workflow engine.

## 9. Suggested Project Structure

```text
src/
  app/
    api/
      demo/bounties/route.ts
      demo/bounties/[id]/route.ts
      paid/bounties/route.ts
    demo/
      requests/page.tsx
      shopping/page.tsx
    docs/page.tsx
    earnings/page.tsx
    work/page.tsx
    globals.css
    layout.tsx
    page.tsx
    providers.tsx
  components/
    agent-timeline.tsx
    answer-collector.tsx
    app-header.tsx
    consensus-result.tsx
    payment-step.tsx
    price-breakdown.tsx
    request-panel.tsx
    scenario-card.tsx
  data/
    demo-scenarios.ts
  lib/
    chains.ts
    consensus.ts
    demo-state.tsx
    pricing.ts
    validation.ts
  types/
    bounty.ts
public/
  demo/
    shopping-expiry.webp
    browser-checkout.webp
    marketing-frame.webp
    marketplace-variant.webp
```

Adjust filenames when implementation makes a simpler grouping obvious. The structure is guidance, not a requirement to create empty files.

## 10. Demo API

### `POST /api/demo/bounties`

Input:

```json
{
  "scenarioId": "shopping-expiry"
}
```

Behavior:

- Validate the ID against the seeded scenario list.
- Return a deterministic bounty object.
- Reject unknown IDs with `400`.
- Do not accept freeform media URLs or arbitrary prompts.

### `GET /api/demo/bounties/:id`

Returns the deterministic request, current simulated state, answers, and result.

### `POST /api/paid/bounties`

This is the x402-protected version of bounty creation.

- Without valid payment, respond with the x402 payment requirement.
- With valid payment, return `201` and the seeded bounty.
- Charge the fixed total of `$0.18 USDC` on Base Sepolia.
- Send payment directly to the configured treasury address.
- Do not imply that funds are escrowed or automatically distributed.

At implementation time, follow the current official Base/CDP x402 package and middleware APIs rather than copying stale package names into the code.

## 11. Payment Modes

### Real x402 mode

Use when all required credentials and addresses are configured.

- Wallet must be connected to Base Sepolia.
- UI presents the payment requirement and asks for wallet approval.
- A successful verified payment advances the request to `queued`.
- Display the real transaction reference when the integration provides one.

### Demo-payment fallback

Use when x402 credentials are not configured or during offline judging.

- Show a button labelled `Use demo payment`.
- Display `Demo payment — no transaction submitted`.
- Advance the same deterministic state machine.
- Never generate a fake transaction hash or label a simulation as an onchain payment.

## 12. Configuration

Create a committed `.env.example` containing names only:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=
BOUNTYQ_TREASURY_ADDRESS=
CDP_API_KEY_ID=
CDP_API_KEY_SECRET=
NEXT_PUBLIC_ENABLE_REAL_X402=false
```

Confirm the exact server-side x402/CDP environment variables against current official documentation during implementation. Never expose secrets through `NEXT_PUBLIC_*`, commit a funded private key, or include the supplied Colosseum token in application code.

## 13. Implementation Sequence

### Phase 1 — App shell and domain logic

- Scaffold Next.js with TypeScript and Tailwind.
- Add the global layout and header.
- Define bounty types, seeded scenarios, fixed pricing, state transitions, and consensus.
- Add unit tests for all pure logic.

Checkpoint: the app renders and the domain tests pass.

### Phase 2 — Shopping-agent hero flow

- Build `/demo/shopping`.
- Implement the deterministic reducer-driven sequence.
- Add price, payment, vote, result, continuation, and reset states.
- Ensure the entire flow works without network access in demo mode.

Checkpoint: the primary demo is complete and repeatable.

### Phase 3 — Supporting product surfaces

- Add the landing page.
- Add the scenario gallery and shared request detail.
- Add worker and simulated earnings pages.
- Add integration docs.

Checkpoint: the product breadth is visible without building backend breadth.

### Phase 4 — Wallet and Base integration

- Add wagmi, viem, and RainbowKit providers.
- Configure Base Sepolia only.
- Put the connector and network state in the global header.
- Handle disconnected and wrong-network states cleanly.

Checkpoint: wallet connection works without affecting demo browsing.

### Phase 5 — x402 integration

- Add the protected bounty route using the current official x402 tooling.
- Wire the real-payment UI behind the environment flag.
- Preserve the explicit demo fallback.
- Test success, declined payment, wrong network, and missing configuration.

Checkpoint: a configured environment can make a real Base Sepolia payment, while an unconfigured environment remains demoable.

### Phase 6 — Hardening and presentation

- Add loading, error, and reset behavior.
- Check keyboard navigation, contrast, and mobile layout.
- Run tests, typecheck, lint, and production build.
- Rehearse the 60–90 second demo path.

Checkpoint: the build is judge-ready and its simulated parts are plainly labelled.

## 14. Required Tests

### Unit tests

- Fixed price equals `180000` micro-USDC.
- Two matching non-unclear votes resolve a three-answer request.
- A three-way split is unresolved.
- An `Unclear` majority does not create a factual result.
- Unknown scenario IDs are rejected.
- Illegal state transitions are rejected.
- Reset returns the shopping demo to its initial state.

### Integration and browser checks

- Header wallet control renders.
- Shopping demo completes in demo-payment mode.
- Real-payment controls stay hidden when the feature flag is off.
- Every simulated payment and earning is labelled as demo data.
- Mobile and desktop layouts preserve the full primary flow.

## 15. MVP Completion Criteria

The MVP is complete when:

- A new viewer understands BountyQ from the landing page.
- The shopping-agent demo runs end to end without manual setup.
- The result is machine-readable and visibly causes the agent to continue.
- The other three scenarios show credible product breadth.
- RainbowKit appears in the global header and supports Base Sepolia.
- Real x402 payment can be enabled through configuration.
- Demo mode works without pretending a blockchain transaction occurred.
- No custom smart contract is deployed or required.
- Tests, typecheck, lint, and production build pass.

## 16. Post-MVP Roadmap

Only pursue these after the demo validates demand:

1. Persistent API, database, agent authentication, idempotency, and webhooks
2. Reviewer accounts, KYC integration, payout ledger, and real USDC payouts
3. Private uploads, signed URLs, data retention, and content moderation
4. Reputation, gold-standard questions, fraud detection, and reviewer diversity
5. Request expiry, cancellation, refunds, disputes, and treasury reconciliation
6. Volume-based pricing, enterprise privacy controls, and reliability targets
7. Additional answer formats where categorical answers are insufficient
8. Custom contracts only if non-custodial escrow becomes a demonstrated requirement

## 17. Demo Narrative

Use this framing during the presentation:

> Agents are increasingly able to browse, create, and transact on their own. Their hardest failures are often tiny ambiguities that a person can resolve immediately. BountyQ lets an agent purchase three independent human judgments for a fixed micro-payment, receive a structured consensus, and continue running. The demo uses Base and x402 for machine-native payment, while keeping the human-answer workflow simple and transparent.

