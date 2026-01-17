# AI Agents Commit Guide

All AI agents must use Conventional Commits for every commit.

## Format
`<type>(<scope>): <summary>`

- `type`: one of `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- `scope`: optional, short area of change (e.g. `backend`, `frontend`, `db`, `deps`). Omit if unclear.
- `summary`: imperative, present tense, max ~72 chars, no period.

## Examples
- `feat(backend): add user creation endpoint`
- `fix(db): handle empty result set`
- `docs: add setup instructions`
- `chore(deps): bump express`

## Rules
- One commit = one logical change.
- Do not include unrelated changes in the same commit.
- Reference issues only if they exist (e.g. `Refs #123`).
- Always write commits in English.
- Follow clean architecture boundaries.
- Reuse code as much as possible; avoid duplication.
- Apply SOLID principles where applicable.
- Prefer clean, readable code over cleverness.

## Tests
- Use Node's built-in test runner (`node:test`) with `assert/strict`.
- Place tests under `backend/tests` and mirror the `backend/src` path.
- Use `.test.js` suffix for all test files.
- Keep unit tests in `backend/tests/unit` and integration tests in `backend/tests/integration`.
