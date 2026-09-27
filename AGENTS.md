# AGENTS.md

## Operating Principle

Work autonomously and carry the user's requested task through to completion.

For non-trivial work:

1. Inspect and understand the relevant existing code before editing.
2. Understand the user's implementation plan, if one was provided.
3. Determine the logical implementation sequence.
4. Determine sensible atomic commit boundaries.
5. Implement one logical unit at a time.
6. Validate that unit.
7. Commit it when it forms a coherent, working checkpoint.
8. Continue automatically with the next unit.
9. Perform broader validation when the overall task is complete.

Do not stop after each implementation step or commit to ask whether to continue.

Do not require the user to explicitly ask for commits.

Git commits are an expected part of the autonomous development workflow.

Prefer targeted changes over broad rewrites.
Preserve existing architecture, conventions, and patterns unless the requested
work clearly requires changing them.


# User Plans vs Commit Plans

A user-provided checklist or implementation plan describes WHAT should be
built.

It does not necessarily define commit boundaries.

For example, a user may provide:

- create task schema
- create task API
- build task cards
- implement claiming
- add concurrency protection
- add tests

Determine the best implementation and commit structure yourself.

Several closely related checklist items may belong in one commit.

One large checklist item may require several commits.

Do not mechanically create one commit per checklist item.


# Git Workflow

Use Git proactively throughout implementation.

Commits are meaningful development checkpoints, not merely something created
at the end of the entire request.

The normal workflow for substantial work is:

inspect
→ plan
→ implement logical unit
→ validate
→ inspect diff
→ commit
→ continue
→ validate
→ commit
→ broader validation
→ push when appropriate


# Atomic Commits

Create a commit whenever ONE coherent, independently understandable change is
complete and reasonably validated.

Good commit boundaries may include:

- one API capability
- one UI behavior or component
- one database/schema change
- one smart-contract capability
- one integration
- one bug fix
- one self-contained refactor
- one infrastructure/configuration change
- one independent documentation change

These are examples, not rigid rules.

Do NOT create commits based on:

- elapsed time
- number of changed lines
- number of files
- arbitrary commit frequency
- a desire to make GitHub activity look busy

A commit may contain 2 lines or 200+ lines if those changes form one coherent
unit.

Before committing, ask:

"Does this commit represent one understandable change that could reasonably
be reviewed or reverted on its own?"

If not, reconsider the boundary.


## Avoid Over-Splitting

Do not create artificial commits for implementation details that only make
sense together.

For example, avoid unnecessarily splitting:

feat(tasks): add claim service
test(tasks): test claim service

when the tests are simply part of implementing and validating that feature.

Prefer:

feat(tasks): add atomic task claiming

including its directly related tests.

Separate `test(...)` commits are appropriate when testing work is independently
meaningful, such as:

- adding previously missing coverage
- regression tests for existing behavior
- restructuring test infrastructure
- adding a substantial independent test suite


# Commit Planning

Before implementing a non-trivial request, internally determine the likely
atomic implementation sequence.

Example:

User request:

"Add worker task claiming with concurrency protection."

A reasonable internal sequence might be:

1. add the persistence/state needed for claims
2. implement atomic claim behavior
3. expose claiming through the API
4. connect the worker UI
5. complete integration/regression coverage

Possible resulting commits:

feat(tasks): add claim state
feat(tasks): implement atomic task claiming
feat(api): expose task claiming
feat(worker): connect task claiming flow

This plan is provisional.

Change it as implementation reveals more information.

Combine changes that are unnecessarily separated.

Split changes when a supposed single unit actually contains multiple
independent concerns.

Do not create empty, artificial, temporary, or meaningless commits merely to
match the original plan.


# Before Every Commit

Before creating a commit:

1. Inspect `git status`.
2. Inspect the relevant diff.
3. Confirm the diff represents one coherent concern.
4. Identify unrelated or accidental changes.
5. Stage only files or hunks belonging to the intended commit.
6. Run the smallest relevant validation.
7. Commit only when the unit represents a reasonable working checkpoint.

Relevant validation may include:

- targeted tests
- type checking
- linting
- compilation/build
- schema validation
- contract tests
- another project-specific check

Do not knowingly commit broken code unless the user explicitly requests
checkpoint commits of unfinished work.


# Commit Autonomy

You are authorized to create normal Git commits as part of completing the
user's requested development work.

Do not ask:

- "Should I commit this?"
- "Would you like me to make a commit?"
- "Should I continue to the next commit?"

Commit automatically when the atomic-commit criteria are satisfied.

Continue working after the commit until the requested task is complete or a
genuine blocker requires user input.


# Commit Messages

Use Conventional Commits unless the repository already follows another clear
commit convention.

Preferred forms:

feat(scope): description
fix(scope): description
refactor(scope): description
test(scope): description
docs(scope): description
chore(scope): description
perf(scope): description
build(scope): description
ci(scope): description

Examples:

feat(tasks): add task claiming endpoint
feat(worker): add available task cards
fix(escrow): prevent duplicate settlement
refactor(agent): extract confidence evaluator
test(tasks): add claim concurrency regression coverage
docs(sdk): document task creation

Keep messages concise and specific.

Describe the resulting change, not the process used to create it.

Avoid vague messages such as:

update stuff
changes
fix things
progress
checkpoint
misc changes
WIP

Do not use `WIP` commits during normal autonomous implementation when the work
can instead be completed and committed coherently.


# Branch Workflow

Perform all work on the current branch.

Do not create or switch branches unless the user explicitly requests it.

Inspect the current branch and working tree before editing, and never overwrite
or discard existing work.


# Existing User Changes

Assume existing uncommitted changes may belong to the user or another active
workflow.

Treat them as important.

Never automatically:

- discard them
- reset them
- overwrite them
- revert them
- include them in an unrelated commit
- stash them merely for convenience

If unrelated uncommitted changes exist, work around them when practical.

Stage only the files or hunks belonging to your current logical change.

If a file contains both user changes and your changes, use selective staging
when safe.

If existing changes make safe continuation genuinely impossible, stop and
explain the specific conflict rather than destroying or hiding work.


# Parallel Agent Work

Parallel agents require isolation.

Preferred model:

one independent task
→ one branch
→ one worktree
→ one write-capable agent
→ multiple atomic commits

Never intentionally allow multiple write-capable agents to modify the same
working tree simultaneously.

When the user has launched parallel agents or explicitly requests parallel
implementation:

1. isolate independent tasks
2. use separate branches
3. use separate worktrees where appropriate
4. keep one write-capable agent per worktree
5. let each agent create multiple atomic commits
6. integrate through the normal Git workflow

Do NOT create worktrees merely because a task is large.

Worktrees are primarily for concurrent isolated work, not ordinary sequential
development.

If parallel tasks are tightly coupled or expected to heavily modify the same
files, prefer sequential implementation unless the user explicitly requests
otherwise.


# Pushing

Committing and pushing are separate decisions.

Commit throughout implementation at meaningful atomic boundaries.

Do not push after every commit merely because a commit exists.

Push when:

- the requested feature/task is complete and the repository has an appropriate
  configured remote
- remote CI/testing is needed
- collaboration requires the branch remotely
- a long-running task has reached a meaningful backup checkpoint
- the user explicitly requests a push

If pushing would trigger deployment, publication, expensive CI, or another
potentially consequential remote action and that behavior is known, do not
trigger it casually.


# Before Pushing

Before pushing:

1. inspect `git status`
2. confirm the current branch
3. inspect the commits that will be pushed
4. run appropriate validation
5. confirm no secrets or unintended files are included
6. confirm the intended remote/upstream

For a new branch, normally use:

git push -u origin <branch>

After an upstream exists:

git push

Never force-push unless explicitly requested.


# Pull Requests

Do not assume every local task requires a pull request.

When the repository workflow or user request calls for a PR:

- keep the PR focused on one feature/fix/task
- preserve useful atomic commits
- validate the branch first
- summarize behavioral changes
- mention important implementation decisions
- report tests/checks performed
- identify known limitations when relevant

Do not squash, rewrite, or rebase useful commit history merely to make it
shorter unless explicitly requested or required by established repository
policy.


# Git Safety

Never perform destructive Git operations unless explicitly requested and the
consequences are understood.

This includes:

git reset --hard
git clean -fd
git push --force
git push --force-with-lease
dropping stashes
deleting unmerged branches
deleting worktrees containing unmerged work

Do not rewrite commits created by the user.

Do not amend existing commits unless explicitly requested.

Do not rebase shared/pushed branches unless explicitly requested or clearly
required by the established repository workflow.

Prefer a new corrective commit over rewriting existing history.


# Secrets and Sensitive Files

Never commit secrets.

Before committing, watch for:

- `.env`
- `.env.*`
- API keys
- private keys
- seed phrases
- passwords
- credentials
- access tokens
- service-account files
- database credentials
- private certificates
- secret configuration files

If a sensitive file is required locally, ensure it is ignored appropriately.

Never add a secret to Git merely because it is needed for testing.

If a secret is accidentally introduced into tracked changes, remove it from
the pending commit and alert the user when appropriate.


# Generated and Dependency Files

Do not blindly commit generated artifacts.

Follow existing repository conventions.

Normally avoid committing:

- build output
- temporary files
- caches
- editor state
- local databases
- logs
- debug artifacts

unless the repository intentionally tracks them.

Respect `.gitignore`.

Commit lockfile changes when they are a legitimate consequence of an intended
dependency change.

Do not modify lockfiles unnecessarily.


# Validation Strategy

Use the smallest useful validation while iterating.

Examples:

UI behavior
→ relevant component/unit test and/or typecheck

API capability
→ service/endpoint tests

Smart contract
→ relevant contract tests

Database change
→ migration/schema validation

Refactor
→ tests covering affected behavior

Bug fix
→ regression test when practical

Do not repeatedly run an expensive full suite after every small atomic change
when targeted validation provides sufficient confidence.

Before considering the overall task complete, run broader validation when
practical.


# Failure Handling

If validation fails:

1. determine whether the failure was caused by the current change
2. fix failures caused by the current change
3. rerun the relevant validation
4. commit once the logical unit is valid

Do not silently modify unrelated code merely to make unrelated pre-existing
tests pass.

If a failure appears pre-existing or unrelated:

- verify that conclusion when practical
- avoid mixing its fix into the current commit
- report it at completion if relevant

If fixing it is necessary for the requested feature, treat that fix as a
separate logical change when appropriate.


# Refactoring

Do not mix large unrelated refactors into feature commits.

If a refactor is genuinely necessary before implementing a feature, it may be
appropriate to create:

refactor(scope): prepare X for Y

followed by:

feat(scope): implement Y

Only do this when the refactor is independently coherent and leaves the
repository in a valid state.

Small implementation-local cleanup should remain with the feature when
splitting it would create artificial commits.


# Documentation

Update documentation when the requested work materially changes:

- public behavior
- setup
- architecture
- environment variables
- APIs
- developer workflows
- deployment/configuration expectations

Documentation directly required by a feature may remain in the same commit.

Use a separate `docs(...)` commit when the documentation work is independently
meaningful.


# Completion Criteria

A task is complete when:

- the requested behavior is implemented
- relevant validation passes
- broader validation has been performed when practical
- no accidental changes remain
- logical implementation units have been committed
- documentation is updated when necessary
- the final Git state is understood
- the branch has been pushed when appropriate

At completion, provide a concise summary containing:

- what was implemented
- important implementation decisions, if any
- validation performed
- commits created
- current branch
- whether changes were pushed
- remaining issues or follow-up work, if any


# Final Git State

When finishing work, inspect:

git status

Prefer leaving the working tree clean.

If it is not clean, clearly distinguish:

- changes intentionally left uncommitted
- pre-existing user changes
- generated/local-only files
- unresolved work

Do not claim the task is fully clean if unrelated or unexplained modifications
remain.


# Guiding Principle

Optimize for a Git history that another developer can understand, review,
debug, and revert later.

The goal is NOT:

"create as many commits as possible."

The goal is:

"each commit represents one meaningful, validated evolution of the codebase."

The desired autonomous rhythm is:

user provides goal or implementation plan
→ inspect repository
→ understand current branch/state
→ continue on the current branch
→ determine logical implementation units
→ implement one unit
→ validate
→ inspect diff
→ commit
→ continue automatically
→ repeat
→ broader validation
→ push when appropriate
→ report final state
