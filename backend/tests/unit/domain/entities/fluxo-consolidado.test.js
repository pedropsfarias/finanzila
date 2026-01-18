import assert from "node:assert/strict";
import test from "node:test";

import createFluxoConsolidado from "../../../../src/domain/entities/fluxo-consolidado.js";

test("createFluxoConsolidado returns domain fields", () => {
  const fluxo = createFluxoConsolidado({
    id: 1,
    mesReferencia: "2024-03-01",
    data: "2024-03-10",
    descricao: "Cartao",
    valorEstimado: 320,
    dataPagamento: "2024-03-15",
    valorPagamento: 310,
    criadoEm: "2024-03-01T00:00:00Z",
    atualizadoEm: "2024-03-02T00:00:00Z"
  });

  assert.deepEqual(fluxo, {
    id: 1,
    mesReferencia: "2024-03-01",
    data: "2024-03-10",
    descricao: "Cartao",
    valorEstimado: 320,
    dataPagamento: "2024-03-15",
    valorPagamento: 310,
    criadoEm: "2024-03-01T00:00:00Z",
    atualizadoEm: "2024-03-02T00:00:00Z"
  });
});
