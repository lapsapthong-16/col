# BountyQ

## Human judgment for always-running AI agents

AI agents can search, browse, create content, monitor markets, and make payments around the clock.

But even a capable agent eventually reaches a small decision where guessing is expensive, waiting for its owner defeats the point of autonomy, and another model call may not resolve the ambiguity.

BountyQ gives the agent another option:

> Buy a small amount of human judgment and continue working.

BountyQ is a consumer judgment network. Autonomous agents submit small, structured decisions. Qualified people answer them through rapid earning sessions. Agents receive machine-readable results, and reviewers earn USDC on Base.

```text
Always-running agent
        ↓
economically meaningful uncertainty
        ↓
BountyQ request
        ↓
qualified human judgments
        ↓
structured result
        ↓
agent continues

Humans earn USDC for supplying the judgment AI still needs.
```

---

## The problem

Autonomous agents are useful until a small ambiguous decision blocks an otherwise automated workflow.

An agent then has four common options:

1. Guess and risk making the wrong decision.
2. Buy more AI inference without knowing whether it will resolve the uncertainty.
3. Stop and wait for its owner.
4. Interrupt its owner and ask for help.

All four reduce the value of an always-running agent.

BountyQ introduces a fifth option:

5. Ask suitable people the smallest possible question, pay for their judgment, and continue.

BountyQ does not replace AI. It handles the uncertain tail where a small human decision is economically preferable to waiting, guessing, or spending more on inference.

---

## Example: an autonomous shopping agent

A user gives an agent a standing instruction:

> Find discounted skincare products on Shopee from reputable sellers. Buy only the correct formulation and size, with intact packaging and sufficient remaining shelf life.

The user goes offline. The agent keeps searching.

Most listings are easy to reject automatically: price too high, wrong formulation, low seller rating, wrong size, clearly expired, or missing information.

Eventually, the agent finds a valuable deal. The text matches the user's requirements, but the photos create one unresolved question:

> Does the expiry label say 2027 or 2022?

Waiting for the owner could mean losing the deal. Guessing could mean purchasing an expired product. More OCR or vision inference may remain uncertain.

```python
result = bountyq.inspect(
    image=expiry_label,
    question="Does this label show an expiry year of 2027?",
    answers=["yes", "no", "unclear"],
    respondents=3,
    max_cost_usdc="0.30",
    deadline_seconds=300,
)
```

BountyQ returns:

```json
{
  "status": "resolved",
  "answer": "yes",
  "agreement_score": 0.93,
  "respondents": 3,
  "cost_usdc": "0.14",
  "completed_in_seconds": 84
}
```

The agent applies the user's purchasing policy and continues.

Other shopping questions include:

- Is this the correct product variant?
- Is the security seal visibly intact?
- Is this full-sized or travel-sized?
- Does the packaging show visible damage?
- Is the charger or accessory shown in the listing?
- Are these two listings showing the same exact item?

---

## Example: an always-running marketing agent

A marketing agent continuously produces and tests product videos, thumbnails, and captions.

Before publishing, it detects uncertainty that model self-evaluation cannot reliably resolve:

- Is the product clearly visible during the first five seconds?
- Is the logo obscured at any point?
- Is the on-screen text readable on a phone?
- Does the video show the correct product variant?
- Which thumbnail makes the product easiest to identify?
- Which version is clearer to the intended audience?

The agent can request a small consumer panel:

```python
result = bountyq.compare(
    media=[video_a, video_b],
    question="Which video makes the skincare product easier to understand?",
    answers=["video_a", "video_b", "no_preference"],
    respondents=5,
    max_cost_usdc="0.80",
)
```

The agent receives an audience distribution, revises the content, and continues its campaign without waiting for a scheduled research study.

---

## Example: an autonomous browser agent

A browser agent performs a long-running workflow across websites. After an action, the interface is ambiguous:

- Did the form submit successfully?
- Was the payment completed or only authorized?
- Is the correct product variant selected?
- Did the site apply the discount?
- Would repeating the action create a duplicate purchase or post?

The agent submits the relevant screenshot and a categorical question to BountyQ. Human reviewers answer from the supplied evidence, and the agent continues according to its own policy.

The initial sources of demand are therefore:

- marketplace-monitoring and autonomous shopping agents;
- autonomous browser agents;
- always-running content and marketing agents.

BountyQ does not need to choose when these agents escalate. Each agent or developer owns that decision and calls BountyQ only when it wants human input.

---

## Two kinds of human judgment

BountyQ distinguishes factual verification from audience judgment.

### 1. Factual verification

These questions have a substantially factual answer:

- Is the screen visibly cracked?
- Does the label show 2027?
- Is the product visible?
- Did checkout complete?
- Are these the same exact variant?

The MVP result uses independent answers and deterministic agreement rules. More advanced reviewer qualification and reputation are future quality controls.

```json
{
  "result_type": "verification",
  "answer": "no_visible_damage",
  "agreement_score": 0.91,
  "eligible_responses": 3
}
```

### 2. Audience judgment

These questions measure a distribution of opinions rather than one objective truth:

- Which thumbnail is clearer?
- Which caption feels more trustworthy?
- Which demonstration is easier to follow?
- How does the intended audience interpret this video?

BountyQ returns the distribution instead of pretending that majority preference is factual certainty.

```json
{
  "result_type": "audience_distribution",
  "responses": {
    "video_a": 0.68,
    "video_b": 0.24,
    "no_preference": 0.08
  }
}
```

---

## When should an agent ask a human?

BountyQ is not for every uncertain decision.

An agent should escalate only when human judgment is economically preferable:

```text
Cost(Human)
<
Expected Cost of a Wrong Decision
+ Expected Opportunity Loss from Waiting
+ Cost of Additional AI Inference
```

If the decision is insignificant, reversible, or free to delay, the agent should not use BountyQ.

The developer controls maximum cost, optional deadline, respondent count, answer schema, and behavior when no result is reached. The calling agent decides when human input is necessary; BountyQ receives and executes the bounty rather than making that decision for the agent.

---

## The consumer product

BountyQ is not only an API. The human side is a consumer earning experience.

Reviewers enter concentrated judgment sessions:

```text
Is the expiry year 2027?
[ YES ] [ NO ] [ UNCLEAR ]
+$0.05

Swipe.

Is the product clearly visible?
[ YES ] [ NO ] [ UNCLEAR ]
+$0.05

Swipe.
```

The product optimizes for earnings per active minute, not the apparent value of one tiny task:

```text
12-minute session
38 valid decisions
$3.40 earned
```

Demand from many autonomous agents is aggregated into high-density sessions so reviewers receive a continuous queue instead of isolated microtasks.

The worker-facing promise is:

> Get paid to make the small decisions AI still cannot make confidently.

---

## Quality and future reputation

The demo does not need a complex public reputation system. Initially, BountyQ only needs enough internal quality control to prevent spam and repeated low-quality submissions.

Over time, reviewers may build domain-specific records based on completed work and known outcomes. This helps BountyQ decide who should receive particular questions; it is not a universal score of whether a person is "good at judgment."

Example qualifications:

- Product Inspector
- Marketplace Matcher
- Web-State Verifier
- Skincare Audience Reviewer
- Collectibles Reviewer
- Local Knowledge Reviewer

Performance can be estimated from hidden gold questions, known outcomes, randomized audits, task validity, completion behavior, and consensus agreement as weak evidence rather than proof of truth.

Future high-performing reviewers may unlock specialist queues, fewer redundant checks, higher payouts, and priority access to scheduled sessions.

New reviewers begin near the population prior. Agreement alone does not equal accuracy, and workers should be paid for valid good-faith participation rather than only for matching the majority.

---

## Why BountyQ is different

Existing human-in-the-loop products generally lead with enterprise approvals, broad human-task marketplaces, surveys, or developer feedback APIs.

BountyQ is focused on a narrower economic loop:

> Always-running agents repeatedly purchase small categorical decisions from a consumer judgment network.

The differentiation is not simply REST, consensus, USDC, or blockchain. Those are implementation tools.

BountyQ is differentiated by:

- a consumer-first answer-and-swipe earning experience;
- concentrated judgment sessions rather than a job board;
- recurring demand from autonomous agents running continuously;
- factual verification and audience judgment as distinct result types;
- future domain qualifications and higher-value queues;
- earnings per active minute as a core marketplace metric;
- policy-controlled budgets, deadlines, and reviewer requirements;
- structured decisions that software can act on immediately;
- accumulated Base settlement instead of one transaction per answer;
- long-term routing and outcome data that matches tasks with the right reviewers.

Developer-facing:

> Give your autonomous agent access to human judgment through one API.

Consumer-facing:

> Earn USDC by supplying the judgment AI still needs.

---

## Core API primitives

The initial product exposes a small set of typed operations over one categorical task engine.

### `inspect()`

Answer a factual question about supplied evidence.

### `match()`

Determine whether two items refer to the same entity or variant.

### `verify()`

Determine whether a stated condition has been satisfied.

### `compare()`

Measure preferences from a group of reviewers. Demographic or interest-based audience targeting is a later capability, not an MVP requirement.

All operations are asynchronous by default:

1. Create a task.
2. Receive a task ID.
3. Poll or wait for a signed webhook.
4. Receive a structured terminal result.

BountyQ does not promise an arbitrary universal response time or require a minimum deadline. Developers may supply a deadline, and the platform routes within the available budget and reviewer supply.

---

## Pricing and consensus

MVP bounties use a fixed payout per valid answer. BountyQ only accepts tasks simple enough to answer directly from the supplied evidence, so it does not need to estimate subjective difficulty.

```text
total price = fixed payout per answer
            × requested respondents
            + platform fee
            + sponsored settlement allowance
```

An agent can specify:

```json
{
  "max_cost_usdc": "0.50",
  "respondents": 3,
  "minimum_agreement": 0.75,
  "on_failure": "return_unclear"
}
```

BountyQ publishes the current fixed answer rate. The agent selects the number of respondents and authorizes the resulting maximum cost. BountyQ charges only for valid accepted work and fees and releases any unused amount.

A valid bounty is one self-contained categorical question that can be answered from the supplied image, video, text, or screenshot without external research. BountyQ does not rewrite poorly phrased questions for the agent. Reviewers can skip or report questions that are unclear, missing context, unsafe, or impossible to answer.

For factual verification, the MVP routes to the requested number of independent reviewers. Adaptive reviewer counts and specialist routing are future capabilities.

For audience judgment, disagreement is part of the result rather than a failure to reach truth.

---

## Privacy and safety

The initial product is designed for public or intentionally shareable evidence: public marketplace listings, public product images, marketing assets intentionally submitted for review, non-sensitive browser states, and redacted screenshots.

The MVP should reject credentials, payment information, identity documents, biometrics, private communications, licensed professional decisions, high-impact decisions, CAPTCHA solving, anti-bot circumvention, surveillance, doxxing, illegal goods, and exploitative content.

Assets remain offchain, encrypted, and available through short-lived URLs. Sensitive regions and metadata should be removed where possible. No UI can fully prevent screenshots, so developers must control what they are permitted to expose.

Enterprise-private content would require separate reviewer pools, stronger isolation, contractual controls, and a different operating model. It is not an MVP claim.

---

## Why Base?

BountyQ creates a new economic relationship:

```text
autonomous software
        ↓
buys $0.03-$1.00 of human judgment
        ↓
person earns USDC
```

Base provides low-cost USDC settlement, programmable agent wallets and spending policies, auditable funding, smart-account infrastructure, x402-compatible machine payments, and an ecosystem focused on agentic commerce.

Base is the economic layer, not the database for human answers.

```text
Agent wallet
    ↓ USDC funding
BountyQ balance / vault
    ↓ offchain task accounting
Worker earnings accumulate
    ↓ threshold or batched settlement
Worker wallet on Base
```

Questions, images, answers, routing, consensus, and private reputation remain offchain. Putting every small answer onchain would increase cost and complexity without improving the product.

---

## Architecture

```text
                     AUTONOMOUS AGENT
                            |
             inspect / match / verify / compare
                            |
                            v
                    BountyQ API
                            |
              +-------------+-------------+
              |                           |
              v                           v
        Decision Router              Payment Router
      task type + reviewers       balance + spend policy
              |                           |
              +-------------+-------------+
                            |
                            v
                       Task Queue
                            |
             +--------------+--------------+
             |              |              |
             v              v              v
        Reviewer A     Reviewer B     Reviewer C
             |              |              |
             +--------------+--------------+
                            |
                            v
                 Result / Consensus Engine
                            |
                            v
                  Structured Agent Result

                  Base / USDC settlement
```

Suggested implementation:

- Next.js, TypeScript, and Tailwind CSS;
- RainbowKit, wagmi, and viem;
- Python, FastAPI, and Pydantic;
- PostgreSQL as the source of truth;
- Redis-backed jobs and assignment leases;
- private object storage for media;
- Solidity and Foundry for Base settlement;
- USDC on Base Sepolia for the initial implementation;
- polling and signed webhooks for agent results.

The detailed engineering plan is in [`PLAN.md`](./PLAN.md).

---

## MVP

The MVP proves one complete economic loop.

### Agent side

A developer or agent submits an image, one categorical question, answer choices, respondent count, maximum budget, and an optional deadline. The API returns a task ID and later provides a structured result through polling or a signed webhook.

### Consumer side

Reviewers:

1. Enter a judgment session.
2. Receive one task at a time.
3. See the question, evidence, choices, and payout.
4. Answer, skip, or report.
5. Accumulate USDC-denominated earnings.
6. Withdraw earnings to a Base wallet.

Production payouts will require identity and eligibility controls such as KYC, supported-country checks, and abuse prevention. The hackathon demo does not need to implement or showcase KYC; it should state this production requirement and leave integration to a future identity or compliance provider.

### Marketplace side

BountyQ validates task eligibility, calculates the fixed-rate quote, reserves the maximum authorized cost, routes independent assignments, calculates a result, charges accepted work and fees, releases unused funds, credits reviewer earnings, and returns structured JSON.

### Initial demo

An always-running shopping agent finds a discounted skincare listing but cannot read the expiry year confidently. It submits the cropped label, three reviewers answer, the result returns, and the agent continues according to its purchase policy. Agent funding and worker settlement are demonstrated on Base Sepolia.

---

## Business model

BountyQ charges a platform fee on completed judgment work.

```text
Agent maximum authorization:   $0.50
Accepted worker payouts:       $0.15
Platform fee:                  $0.03
Sponsored settlement reserve:  $0.01
Unused authorization returned: $0.31
```

The exact price must sustain acceptable reviewer earnings per active minute. Low per-task prices work only when demand is dense and the interface minimizes idle time.

Potential long-term revenue includes platform fees, premium qualified pools, targeted audience panels, specialist queues, developer spending controls, and enterprise-private pools after the consumer network is proven.

---

## Future roadmap

The MVP focuses on receiving simple categorical bounties, collecting answers, returning structured results, and settling earnings.

Later capabilities may include:

- notifications when relevant bounty queues become active;
- scheduled high-density earning sessions when sufficient demand exists;
- reviewer qualifications and domain-specific reputation;
- KYC and supported-country checks through an external protocol or provider;
- audience targeting for content and marketing questions;
- specialist pools and higher-value bounties;
- automated rate changes only if fixed pricing fails to attract enough supply;
- optional agent-side SDKs for teams that want help defining escalation policies.

These features should be added only after real task volume demonstrates that they are necessary.

---

## The central assumption

BountyQ succeeds only if always-running agents create enough economically justified uncertainty to sustain worthwhile consumer earning sessions.

The important experiment is not whether the API can be built. It is whether:

- agents repeatedly encounter suitable decisions;
- developers permit those questions to reach external reviewers;
- human results materially change agent behavior;
- developers pay enough to support reviewers;
- reviewers return because earnings per active minute are worthwhile;
- aggregated demand creates dense sessions instead of an empty task feed.

The first behavioral milestone is:

- at least three external agent developers submit real tasks;
- at least five external reviewers complete them;
- at least 25 real decisions run end to end;
- at least two developers return with additional tasks;
- at least one developer pays or commits to paying;
- worker earnings and marketplace economics are measured honestly.

---

## Vision

Autonomy does not mean AI must make every decision itself.

The best autonomous systems will know when another resource is better: sometimes a larger model, another API, more compute, their owner, or a person available through BountyQ.

As agents perform more continuous and economically meaningful work, they will generate a new category of demand: small decisions that remain easier, safer, or cheaper for people.

BountyQ turns that demand into a consumer earning network.

> Agents buy judgment. People earn for supplying it.
