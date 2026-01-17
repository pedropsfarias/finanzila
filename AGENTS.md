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
