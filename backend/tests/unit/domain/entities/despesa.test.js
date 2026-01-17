import assert from "node:assert/strict";
import test from "node:test";

import createDespesa from "../../../../src/domain/entities/despesa.js";

test("createDespesa returns domain fields", () => {
  const despesa = createDespesa({
    id: 1,
    dia: 10,
    descricao: "Internet",
    valorEstimado: 120.5,
    criadoEm: "2024-02-01T00:00:00Z",
    atualizadoEm: "2024-02-02T00:00:00Z"
  });

  assert.deepEqual(despesa, {
    id: 1,
    dia: 10,
    descricao: "Internet",
    valorEstimado: 120.5,
    criadoEm: "2024-02-01T00:00:00Z",
    atualizadoEm: "2024-02-02T00:00:00Z"
  });
});
