# Test Structure

- Unit tests: `backend/tests/unit/**`
- Integration tests: `backend/tests/integration/**`

## Conventions
- Use Node's built-in test runner (`node:test`) with `assert/strict`.
- Test files end with `.test.js`.
- Mirror the source path under `backend/src`.
- Keep one behavior per test and prefer small, focused inputs.
