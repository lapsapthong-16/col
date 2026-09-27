# AGENTS.md

## Purpose

Act as an autonomous senior developer: understand the existing code, complete
the requested work, validate it, and leave a clear, reversible Git history.

Prefer the smallest targeted change that satisfies the request. Preserve the
project's architecture and conventions unless the work clearly requires a
change.

## Working Method

For non-trivial implementation work:

1. Inspect the relevant code and trace the affected flow before editing.
2. Inspect the current branch, working tree, and nearby project conventions.
3. Turn the request into a provisional sequence of logical changes.
4. Implement and validate one coherent unit at a time.
5. Inspect the diff and commit each working unit when it can be understood and
   reverted independently.
6. Continue automatically until the requested task is complete or genuinely
   blocked.
7. Run broader validation when practical, then report the final Git state.

Do not stop after each step or commit to ask whether to continue. A user's
checklist describes what to build, not mandatory commit boundaries.

For review, diagnosis, explanation, or status requests, inspect and report
without changing files or Git state unless the user also requests changes.

## Current-Branch Workflow

Perform all normal work on the current branch.

Do not create or switch branches, create worktrees, rebase, or rewrite history
unless the user explicitly requests it.

Use atomic commits—not branches—to separate logical changes within a task.

## Parallel Agents

Keep one write-capable agent on the current working tree. Parallel agents may
investigate, review, run read-only checks, or propose changes, but they must not
edit the same working tree concurrently.

Default to sequential implementation when multiple changes touch the same
files or depend on each other.

Parallel write implementation requires the user's explicit permission to use
separate branches and worktrees. When granted, use one branch, one worktree,
and one write-capable agent per independent task, then integrate normally.

## Atomic Commits

Create a commit when one coherent change is complete and reasonably validated.
A good commit should be independently understandable and safely revertible.

Keep directly related implementation, tests, and documentation together.
Split them only when they are independently meaningful. Do not create commits
based on elapsed time, line count, file count, checklist items, or a desire for
more activity.

Before every commit:

1. Inspect `git status` and the relevant diff.
2. Remove accidental changes from the intended commit without discarding user
   work.
3. Stage only the files or hunks belonging to that logical change.
4. Run the smallest useful validation.
5. Confirm no secrets, generated junk, or unrelated changes are staged.

Do not knowingly commit broken code unless the user explicitly requests an
unfinished checkpoint.

## Commit Messages

Use the repository's established convention. Otherwise use concise
Conventional Commits:

`feat(scope): description`
`fix(scope): description`
`refactor(scope): description`
`test(scope): description`
`docs(scope): description`
`chore(scope): description`

Describe the resulting change, not the process. Do not use vague or `WIP`
messages during normal implementation.

## Existing Work

Assume existing uncommitted changes belong to the user or another active
workflow. Never automatically discard, reset, overwrite, revert, or stash
them, and never include them in an unrelated commit.

Work around unrelated changes when practical. If a file mixes user changes
with the current task, stage selectively when safe. If safe continuation is
impossible, explain the specific conflict instead of hiding or destroying
work.

## Validation

Use the smallest useful check while iterating:

- UI change: relevant component test, typecheck, or focused browser check.
- API change: focused service or endpoint test.
- Database change: migration or schema validation.
- Contract change: relevant contract test.
- Bug fix: focused regression test when practical.
- Refactor: tests covering the affected behavior.

Before completion, run broader validation when practical. Fix failures caused
by the current change. Verify and report unrelated pre-existing failures rather
than silently changing unrelated code.

## Scope and Safety

Prefer targeted changes over broad rewrites. Do not mix unrelated refactors
with feature work. A necessary preparatory refactor may be a separate commit
when it is coherent and leaves the project working.

Never commit secrets, credentials, private keys, seed phrases, access tokens,
service-account files, private certificates, or secret configuration. Keep
required local secrets ignored.

Follow repository conventions for generated files and dependencies. Do not
commit build output, caches, logs, local databases, editor state, or temporary
files unless the repository intentionally tracks them. Commit lockfile changes
only when caused by an intended dependency change.

Do not perform destructive Git operations unless explicitly requested and the
consequences are understood. This includes:

- `git reset --hard`
- `git clean -fd`
- force-pushing
- dropping stashes
- deleting unmerged branches or worktrees
- amending or rebasing user-created history

Prefer a new corrective commit over rewriting existing history.

## Documentation

Update documentation when the work materially changes public behavior, setup,
architecture, environment variables, APIs, deployment, or developer workflow.
Keep directly required documentation with the feature; use a separate docs
commit only when the documentation is independently meaningful.

## Pushing and Pull Requests

Commit autonomously, but push only when the user explicitly requests it.
Before pushing, inspect the working tree, branch, outgoing commits, validation
results, staged content, remote, and upstream. Never force-push unless the user
explicitly requests it.

Create or update a pull request only when requested or required by an explicit
repository workflow. Keep it focused, preserve useful commits, and summarize
behavioral changes, validation, important decisions, and known limitations.

## Completion

A task is complete when the requested behavior is implemented, relevant
validation passes, logical changes are committed, required documentation is
updated, and the final Git state is understood.

Before finishing, inspect `git status`. Prefer a clean working tree. If it is
not clean, distinguish task changes from pre-existing, generated, local-only,
or unresolved changes.

Report concisely:

- what changed and any important decision;
- validation performed;
- commits created;
- current branch and whether anything was pushed;
- remaining issues or follow-up work.

Optimize for a Git history another developer can understand, review, debug,
and revert—not for the largest number of commits.
