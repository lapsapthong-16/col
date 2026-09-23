# HumanFallback — Colosseum Crypto World's Fair 2026 Submission Checklist

> Working document for the **Base ecosystem track**. Last verified: **2026-09-22**.
>
> Competition window: **September 14–October 12, 2026**. Confirm the exact deadline time and timezone in the Arena dashboard; the public page currently states only the date.

## Verdict: does HumanFallback fit the Base track?

**Yes — strong fit, provided Base is part of the working product rather than presentation-only infrastructure.**

HumanFallback creates a native machine-to-human payment relationship: an autonomous agent buys a small unit of human judgment, receives a structured answer, and continues its workflow. That maps directly to Base's strengths in agent wallets, USDC, programmable spending policies, low-cost settlement, and x402-style paid APIs.

The clearest positioning is:

> Agents already buy inference, search, data, and browser execution. HumanFallback gives them one more callable resource: human judgment.

### Why the fit is compelling

- The customer is an autonomous agent or agent developer, not a person manually purchasing a service.
- Human judgments naturally form a paid API with a price, deadline, confidence target, and structured response.
- USDC gives the agent a programmable budget and gives workers portable earnings.
- Base is useful for deposits, authorization, auditable balances, and batched settlement while high-frequency task accounting remains offchain.
- x402 can eventually make `POST /inspect` behave like a paid endpoint without API-key billing.
- The business can be venture-scale infrastructure rather than a single consumer application.

### What would weaken the Base-track case

- A normal web app with a wallet-connect button added near the deadline.
- Simulated payments, hard-coded transaction hashes, or no Base Sepolia/mainnet transaction in the demo.
- Saying blockchain is needed only because it is transparent or decentralized.
- Paying every $0.03 answer in a separate transaction without explaining the economics.
- Claiming global worker payments solve compliance automatically.
- A demo where no real agent calls the API, no real reviewer answers, or no structured result returns.
- Describing Base features that are not actually implemented.

### Minimum proof for a credible Base submission

- [ ] Agent wallet has a USDC-denominated HumanFallback budget or funded balance.
- [ ] Agent creates a real judgment request through the API/SDK.
- [ ] A separate worker session receives and answers the task.
- [ ] Backend computes a result and returns structured JSON to the agent.
- [ ] Cost is deducted from the agent balance and credited to the worker balance.
- [ ] At least one real Base Sepolia or Base mainnet transaction is visible and linked to a block explorer.
- [ ] The demo clearly distinguishes onchain custody/settlement from offchain task accounting.
- [ ] Spending caps, authorization, or another agent-safety control is demonstrated.

---

## 1. Eligibility and registration

- [ ] Create a Colosseum account and join **Crypto World's Fair**.
- [ ] Ensure every team member has their own Colosseum account.
- [ ] Team leader adds every member during product submission.
- [ ] Confirm every person is on only this one team and submission; Colosseum permits one submission per individual/team.
- [ ] Confirm this is a new startup that has not raised significant outside funding.
- [ ] Record all work completed before September 14, 2026.
- [ ] Disclose all relevant pre-hackathon development and pre-existing code honestly in the portal.
- [ ] Keep evidence of work completed during September 14–October 12: commits, issues, changelog, deployments, user feedback, and weekly updates.
- [ ] Read and follow the current official rules, Terms of Service, and Code of Conduct.
- [ ] Confirm all submission content is in English if required by the current official rules.
- [ ] Verify the exact submission deadline, time, and timezone in Arena at least 72 hours before close.

## 2. Submission portal assets

The official Colosseum FAQ currently says the portal requests the following.

- [ ] **Product name:** HumanFallback.
- [ ] **One-line description:** prepared and under the portal character limit.
- [ ] **Brief product description:** problem, user, solution, and why now.
- [ ] **Ecosystem/track:** Base.
- [ ] **Blockchains and tools:** list only integrations that actually work.
- [ ] **Team:** every member, role, relevant background, and previous experience.
- [ ] **Team location:** consistent across profiles and submission.
- [ ] **Logo/product graphic:** high-resolution square version plus transparent PNG/SVG where supported.
- [ ] **GitHub repository URL:** accessible to judges.
- [ ] **Presentation video:** 2–3 minutes, clear and high quality.
- [ ] **Product demo video:** no more than 3 minutes.
- [ ] **Go-to-market strategy.**
- [ ] **Demand validation/traction.**
- [ ] **Distribution plan.**
- [ ] **Pre-existing work disclosure.**
- [ ] Add any optional links the portal supports: live app, API docs, pitch deck, block explorer, social profile, and contact email.

If the repository remains private:

- [ ] Grant `hackathon@colosseum.com` access before submitting.
- [ ] Test access from an account that is not already a collaborator.
- [ ] Keep access active through judging and interviews.

## 3. Recommended submission copy

Refine these after the MVP and validation are real; do not make claims the product cannot prove.

### One-line description

> HumanFallback is a paid human-judgment API that lets autonomous agents resolve high-value uncertainty and continue working without interrupting their owners.

### Short description

> When an autonomous agent encounters a decision where guessing, waiting, or buying more AI inference is more expensive than asking a person, it calls HumanFallback. HumanFallback routes a minimal question to suitable reviewers, computes confidence from their answers, and returns structured data to the agent. Base gives agents programmable USDC budgets and provides the settlement layer for worker earnings, while task-level accounting stays offchain for speed and cost efficiency.

### Why Base

> HumanFallback creates a new payment relationship: software paying people for small units of judgment. Base lets an agent hold and spend USDC under explicit limits, fund a HumanFallback balance, and settle accumulated worker earnings without requiring a card, subscription, or direct banking relationship between every agent and reviewer. Its low-cost EVM environment and paid-API ecosystem make human judgment behave like another service an agent can purchase.

### Tagline options

- Primary: **Human judgment as an API for autonomous AI.**
- Demo-friendly: **When AI isn't sure, ask us.**
- Worker-facing: **Replace doomscrolling with decisions that earn.**

## 4. Product scope judges must be able to test

### Agent/API side

- [ ] `POST /inspect` accepts an image or public URL, a precise question, answer choices, budget, deadline, and confidence target.
- [ ] API returns a task ID immediately.
- [ ] `GET /tasks/{id}` or webhook returns status and final structured result.
- [ ] Final response includes answer, confidence, respondent count, cost, and timing.
- [ ] Provide one copy-paste SDK or cURL example that works against the deployed service.
- [ ] Reject invalid answer choices, missing evidence, oversized uploads, and insufficient budgets cleanly.
- [ ] Idempotency prevents duplicate tasks and accidental duplicate charges.
- [ ] Agent can enforce per-task and total spending limits.

Suggested response shape:

```json
{
  "task_id": "task_123",
  "status": "completed",
  "answer": "no",
  "confidence": 0.96,
  "respondents": 3,
  "cost_usdc": "0.12",
  "network": "base-sepolia"
}
```

### Worker side

- [ ] Worker can sign in or connect a wallet with a low-friction flow.
- [ ] Feed shows one small, unambiguous task at a time.
- [ ] Evidence, question, choices, reward, and expected response time are visible.
- [ ] Worker can answer, skip, or flag unsafe/unclear content.
- [ ] Earnings and completed-task history update visibly.
- [ ] The demo includes at least two independent reviewer identities if consensus is claimed.
- [ ] Reputation or quality weighting is either implemented or explicitly labeled as roadmap.

### Routing and consensus

- [ ] A task moves through explicit states: created, funded, assigned, answered, completed/expired/refunded.
- [ ] Consensus logic is deterministic and documented.
- [ ] Tie/unclear handling is implemented.
- [ ] Deadline behavior is implemented.
- [ ] Unused funds or failed-task behavior is defined.
- [ ] Confidence is not presented as statistically rigorous unless the method supports that claim.

### Base/payment layer

- [ ] Use the correct Base network, chain ID, RPC, token address, and explorer.
- [ ] Use Base Sepolia for the hackathon demo unless mainnet is genuinely necessary.
- [ ] Agent deposit/funding transaction works from a fresh wallet.
- [ ] Internal ledger never credits more value than the agent funded.
- [ ] Worker accrual and withdrawal/batch settlement path is demonstrated.
- [ ] Transaction status, failures, retries, and confirmations are handled.
- [ ] Contract addresses and explorer links are published in the README.
- [ ] Deployed bytecode matches committed source where applicable.
- [ ] Contracts are verified on the relevant Base explorer where possible.
- [ ] Admin powers, custody assumptions, and trust boundaries are disclosed.
- [ ] Never claim production security or decentralization without evidence/audit.

### Best hackathon-sized architecture

Keep the MVP legible:

1. Agent funds a capped USDC balance on Base.
2. Agent calls `inspect()` with a small decision request.
3. Backend reserves the maximum task cost in an internal ledger.
4. Human reviewers answer through the worker feed.
5. Consensus service returns structured JSON.
6. Worker earnings accumulate offchain.
7. Withdrawal or batch settlement moves accrued funds on Base.

Do not put images, questions, personal data, or individual answers onchain. Use Base for the economic layer; use the application backend for high-frequency orchestration.

## 5. The single demo story

Use one understandable, valuable scenario throughout the product, videos, README, and pitch.

### Recommended scenario: used-phone inspection

An autonomous shopping agent must find an iPhone 16 Pro under RM3,000 with at least 256 GB, battery health above 90%, and no screen damage. It finds a qualifying listing, but one photo may show a crack or reflection.

The demo should show, without cuts that hide the core interaction:

- [ ] Agent evaluates normal listing constraints automatically.
- [ ] Agent identifies one uncertain decision that materially blocks purchase.
- [ ] Agent checks its HumanFallback spending policy.
- [ ] Agent submits the image and asks: “Is there visible screen damage?”
- [ ] Worker feed receives the task.
- [ ] Reviewers answer `yes`, `no`, or `unclear`.
- [ ] Consensus returns `no` with respondent count, confidence, latency, and cost.
- [ ] Agent resumes the workflow based on the structured result.
- [ ] UI shows the Base-funded balance and resulting accounting/payment event.
- [ ] Explorer link proves the onchain component is real.

Avoid adding multiple use cases to the live demo. Mention ticket verification, browser-state verification, and entity matching only as expansion paths.

## 6. Presentation video — 2 to 3 minutes

This is one of the first resources judges review. Target approximately 2:30.

### Suggested outline

- [ ] **0:00–0:15 — Hook:** AI agents can act autonomously until a small ambiguous decision blocks a valuable workflow.
- [ ] **0:15–0:40 — Concrete problem:** show the possible crack/reflection and the cost of guessing or waiting.
- [ ] **0:40–1:15 — Product:** explain `human()`/`inspect()` and show the request/result loop.
- [ ] **1:15–1:40 — Why Base:** programmable USDC budget, machine-native payment, accumulated worker settlement.
- [ ] **1:40–2:05 — Market/business:** agent developers pay per completed judgment; HumanFallback keeps a fee.
- [ ] **2:05–2:25 — Validation:** real tasks, users, interviews, latency, completion rate, or revenue—whatever is truthful.
- [ ] **2:25–2:40 — Founder insight and vision:** agents should know when a person is the cheapest reliable model.

### Quality checks

- [ ] Voice is clear; captions are burned in or reliably available.
- [ ] Text is readable on a laptop and phone.
- [ ] No long logo animation, generic AI montage, or jargon-heavy opening.
- [ ] Say what works today versus what is planned.
- [ ] Include the founder/team on camera briefly if possible.
- [ ] Confirm the final link works without requesting access.
- [ ] Confirm runtime is within the portal requirement.

## 7. Product demo video — maximum 3 minutes

- [ ] Record from a clean environment with seeded demo users and enough test funds.
- [ ] Start with the outcome, then show the complete loop.
- [ ] Show the agent/API request payload.
- [ ] Show the worker receiving and answering the same task ID.
- [ ] Show final structured response to the agent.
- [ ] Show the agent continuing automatically.
- [ ] Show the actual Base explorer transaction or contract interaction.
- [ ] Show spending caps or authorization.
- [ ] Mention which operations are offchain and why.
- [ ] Do not rely on narration to claim functionality absent from the screen.
- [ ] Keep a backup recording and a downloadable copy.
- [ ] Test playback while signed out and in a private browser window.

## 8. GitHub repository readiness

- [ ] Use a clean, understandable repository name.
- [ ] Add an open-source license if the team is comfortable open-sourcing the work; Colosseum encourages open repositories.
- [ ] Add a strong root `README.md` written for judges, not the current concept draft alone.
- [ ] Add architecture diagram and explicit trust boundaries.
- [ ] Add setup instructions that work from a fresh clone.
- [ ] Add `.env.example` containing variable names but no secrets.
- [ ] Add Base contract addresses, network, explorer links, and deployment instructions.
- [ ] Add API documentation and one working request example.
- [ ] Add screenshots or a short GIF of the real product.
- [ ] Add links to live app, presentation video, and demo video.
- [ ] Add a `HACKATHON.md` or README section disclosing pre-existing work and summarizing work completed during the competition.
- [ ] Preserve meaningful commit history showing development during the hackathon.
- [ ] Remove API keys, wallet private keys, seed phrases, tokens, personal data, and test-user credentials from history.
- [ ] Add tests for task state transitions, consensus, ledger invariants, and contract/payment logic.
- [ ] Make the default branch build and tests pass.
- [ ] Pin or lock dependencies.
- [ ] Add a short security/limitations section.
- [ ] Make the fastest judge path obvious: **Live demo → 3-minute video → quick start → architecture → Base transactions**.

Colosseum says it primarily uses the repository to confirm that the team did significant work during the hackathon, performed the work itself, and prioritized features strategically. It does not require a particular framework or design pattern.

## 9. Validation and traction

Do not submit only a thesis. Collect evidence that someone wants this.

### Minimum validation target

- [ ] Interview at least 10 people building or operating autonomous agents.
- [ ] Obtain at least 3 developers willing to test an API request.
- [ ] Run at least 25 real judgment tasks end to end.
- [ ] Recruit at least 5 real reviewers outside the core team.
- [ ] Measure median time to first answer.
- [ ] Measure median time to consensus.
- [ ] Measure task completion/expiry rate.
- [ ] Measure inter-reviewer agreement.
- [ ] Record average agent cost and worker earnings per active minute.
- [ ] Collect at least 2 specific quotes or written commitments, with permission.

### Claims worth showing

- A human resolved a decision faster/cheaper than another inference attempt.
- Agent developers understood the API and could integrate it quickly.
- Reviewers could sustain a useful earnings-per-active-minute rate.
- The decision was valuable enough that waiting for the owner was meaningfully costly.

Never manufacture usage, testimonials, transactions, or revenue. Label pilots and testnet activity accurately.

## 10. Business and go-to-market answers

- [ ] **Initial buyer:** developers running autonomous shopping, browser, sourcing, or monitoring agents.
- [ ] **Initial wedge:** binary/ternary visual verification of public or intentionally shareable evidence.
- [ ] **Pricing:** per completed judgment request; quote worker payout, platform fee, and maximum cost transparently.
- [ ] **Supply acquisition:** concentrated decision sessions rather than isolated microtasks.
- [ ] **Demand acquisition:** direct integrations with agent builders, SDK/MCP/x402 endpoint, examples, and design partners.
- [ ] **Cold-start answer:** manually curate the initial reviewer pool and restrict supported task types/SLA.
- [ ] **Defensibility:** reviewer-quality history, routing data, task taxonomy, latency/reliability, and deep agent integrations—not the smart contract alone.
- [ ] **Expansion:** domain specialists, higher-value verification, API marketplace integrations, and policy-controlled agent procurement.
- [ ] **Market sizing:** use defensible bottoms-up assumptions; avoid unsupported “all AI” TAM claims.
- [ ] **Regulatory/operations:** explain geographic rollout, worker classification/payout review, sanctions/KYC considerations, and prohibited task policy without pretending these are solved by crypto.

## 11. Privacy, safety, and trust

- [ ] MVP accepts only public or intentionally shareable material.
- [ ] Explicitly prohibit personal, confidential, financial, authentication, and enterprise-sensitive information.
- [ ] Redact metadata and sensitive regions where possible.
- [ ] Define data retention and deletion behavior.
- [ ] Give workers a report/flag path.
- [ ] Prevent arbitrary executable files and unsafe URLs.
- [ ] Rate-limit task creation and worker actions.
- [ ] Prevent the agent from exceeding its approved budget.
- [ ] Define dispute, refund, expiration, and unavailable-consensus behavior.
- [ ] Document custody and smart-contract risks.
- [ ] Document reviewer collusion, Sybil, low-quality answer, and answer-copying risks.
- [ ] Do not call reviewer agreement “truth”; describe what confidence means.
- [ ] Add an abuse policy covering illegal content, surveillance, CAPTCHA solving if prohibited, manipulation, and decisions requiring licensed professionals.

## 12. Judging-criteria pass

The current Colosseum FAQ evaluates submissions on the following factors.

### Founder + market fit

- [ ] Explain why this team understands agent infrastructure, human operations, payments, or marketplaces.
- [ ] Tell the specific observation that led to HumanFallback.
- [ ] Show commitment beyond the hackathon.

### Insight

- [ ] State the non-obvious insight: autonomy does not mean the AI must make every decision itself.
- [ ] State the economic routing rule: use a human only when human cost is below the expected cost of waiting, error, or further inference.
- [ ] Explain why increasing model capability does not eliminate the uncertain long tail.

### Product + execution

- [ ] Working end-to-end loop is stable.
- [ ] Core workflow needs no judge setup beyond a browser or one API call.
- [ ] User feedback visibly changed at least one product decision.
- [ ] Scope is focused and reliable.

### Potential market size

- [ ] Start with a credible beachhead and expand outward.
- [ ] Quantify agent task volume and realistic judgment-request frequency.
- [ ] Explain why demand grows as autonomous agents perform more economically consequential work.

### Founder communication

- [ ] Problem is understandable in the first 20 seconds.
- [ ] “Why crypto?” and “Why Base?” each have a crisp answer.
- [ ] Every number in the pitch can be defended.
- [ ] Avoid vague decentralization language.

### Viability

- [ ] Unit economics show agent price, reviewer payout, platform fee, fraud/loss allowance, and gross margin.
- [ ] Explain marketplace liquidity and service-level strategy.
- [ ] Identify which task classes the MVP will refuse.
- [ ] Show a credible path from managed service to scalable platform.

### Traction

- [ ] Report real usage, interviews, integrations, waitlist, revenue, or letters of intent.
- [ ] Separate testnet volume from paid production activity.
- [ ] Include dates and sample sizes for all metrics.

## 13. Weekly updates

Colosseum says weekly updates are not strictly required for every participant but strongly recommends them for serious competitors. Each should be a concise one-minute video covering progress and notable challenges.

- [ ] Week 1 update: problem choice, architecture, Base funding path, first prototype.
- [ ] Week 2 update: working agent-to-worker loop, early user feedback, major challenge.
- [ ] Week 3 update: real tasks, payment/ledger proof, metrics, what changed from feedback.
- [ ] Final update: polished demo, submission links, traction, and remaining limitations.
- [ ] Keep updates factual, dated, and consistent with Git history.

## 14. Interview readiness

Colosseum may invite shortlisted teams to a 15-minute Zoom interview.

- [ ] Prepare a 60-second explanation without slides.
- [ ] Prepare a 3-minute live demo fallback.
- [ ] Every founder can explain the product and their own work.
- [ ] Be ready to answer: why now, why this team, why Base, why not Stripe, why not more AI inference, and why this becomes large.
- [ ] Be ready to explain cold start, reviewer quality, privacy, compliance, custody, and margins.
- [ ] Know current metrics without searching notes.
- [ ] Know the next 90-day roadmap and what the team will do full-time.
- [ ] Have backup demo video and explorer links ready if the live product fails.

## 15. Final 72-hour submission checklist

### 72–48 hours before

- [ ] Freeze feature scope.
- [ ] Confirm Arena submission fields and exact closing time.
- [ ] Create the portal draft early; do not discover required fields on deadline day.
- [ ] Run the full demo from fresh accounts and wallets.
- [ ] Run automated tests and production smoke tests.
- [ ] Verify contract/source/explorer links.
- [ ] Scan repository and Git history for secrets.
- [ ] Record presentation and product demo videos.

### 48–24 hours before

- [ ] Upload videos and verify public/unlisted access while signed out.
- [ ] Proofread submission for inconsistent claims, amounts, networks, and team details.
- [ ] Confirm every link works on desktop and mobile.
- [ ] Confirm private-repository reviewer access if applicable.
- [ ] Verify live app works in a private browser with no cached session.
- [ ] Create a backup deployment or documented fallback.
- [ ] Ask one person unfamiliar with the product to follow the judge path.

### Final day

- [ ] Submit several hours early.
- [ ] Save screenshots/PDF of every submitted field.
- [ ] Save the confirmation email/page and submission URL.
- [ ] Re-open the submitted entry and verify all media and links.
- [ ] Avoid risky deployments after submission unless fixing a critical issue.
- [ ] Monitor the contact email and Colosseum profile for judge questions/interview invitations.

## 16. Current project gaps

As of 2026-09-22, this repository contains the concept README but no implemented product or Git commit history. The critical path is therefore:

1. Build the smallest reliable end-to-end loop.
2. Make the Base funding/authorization/settlement component real and inspectable.
3. Get external agent developers and reviewers to use it.
4. Measure the loop.
5. Replace the current long-form concept README with a judge-facing repository README while preserving the underlying product rationale elsewhere.
6. Produce two separate videos: company/pitch presentation and product demo.

## 17. Official references

Recheck these before submission because requirements can change during a live competition.

- [Colosseum Hackathon page and FAQ](https://colosseum.com/hackathon)
- [Crypto World's Fair announcement](https://blog.colosseum.com/expanding-the-arena/)
- [Current developer resources, including Base](https://colosseum.com/worldsfair/resources)
- [Official hackathon resource repository](https://github.com/ColosseumOrg/hackathon-resources)
- [Base documentation](https://docs.base.org/get-started/base)
- [Connect to Base](https://docs.base.org/get-started/connect-to-base)
- [Base payments documentation](https://docs.base.org/base-account/guides/accept-payments)
- [x402 documentation](https://docs.cdp.coinbase.com/x402/welcome)

---

## Submission gate

Do not submit until every answer below is **yes**:

- [ ] Can a judge understand the problem in 20 seconds?
- [ ] Can a real agent create a real task?
- [ ] Can a separate real human answer it?
- [ ] Does the agent receive a structured result and continue?
- [ ] Is the Base transaction/payment component real and visible?
- [ ] Is Base essential to the product's machine-payment model?
- [ ] Are all claims, metrics, and integrations truthful?
- [ ] Do both videos meet their separate time limits?
- [ ] Can judges access the repository and live product?
- [ ] Is pre-existing work disclosed?
- [ ] Is the submission complete before the confirmed deadline?
