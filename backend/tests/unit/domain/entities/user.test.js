import assert from "node:assert/strict";
import test from "node:test";

import createUser from "../../../../src/domain/entities/user.js";

test("createUser returns domain fields", () => {
  const user = createUser({
    id: "id-1",
    email: "ana@example.com",
    name: "Ana",
    criadoEm: "2024-01-01T00:00:00Z",
    atualizadoEm: "2024-01-02T00:00:00Z"
  });

  assert.deepEqual(user, {
    id: "id-1",
    email: "ana@example.com",
    name: "Ana",
    criadoEm: "2024-01-01T00:00:00Z",
    atualizadoEm: "2024-01-02T00:00:00Z"
  });
});
