import test from "node:test";
import assert from "node:assert/strict";
import generateFluxoConsolidadoUseCase from "../../../../src/application/usecases/generate-fluxo-consolidado.js";

test("generateFluxoConsolidado uses fechamento as first day of next cycle", async () => {
  const created = [];
  let removedMesReferencia = null;
  const fluxoConsolidadoRepository = {
    removeByMesReferencia: async (mesReferencia) => {
      removedMesReferencia = mesReferencia;
    },
    create: async (item) => {
      created.push(item);
      return item;
    }
  };
  const despesasRepository = {
    list: async () => []
  };
  const carteirasRepository = {
    list: async () => [
      { id: 1, nome: "Cartao A", diaFechamento: 12, diaPagamento: 15 }
    ]
  };
  const fluxoCaixaRepository = {
    list: async () => [
      { carteiraId: 1, data: "2023-12-12", valor: 100 },
      { carteiraId: 1, data: new Date(Date.UTC(2023, 11, 12)), valor: 75 },
      { carteiraId: 1, data: "2023-12-11", valor: 50 },
      { carteiraId: 1, data: "2024-01-11", valor: 200 },
      { carteiraId: 1, data: "2024-01-11T10:00:00", valor: 25 },
      { carteiraId: 1, data: "2024-01-12", valor: 300 },
      { carteiraId: 2, data: "2024-01-10", valor: 999 }
    ]
  };

  await generateFluxoConsolidadoUseCase(
    { fluxoConsolidadoRepository, despesasRepository, carteirasRepository, fluxoCaixaRepository },
    { mesReferencia: "2024-01-01" }
  );

  assert.equal(removedMesReferencia, "2024-01-01");
  assert.equal(created.length, 1);
  assert.equal(created[0].valorEstimado, 400);
  assert.equal(created[0].data, "2024-01-15");
  assert.equal(created[0].dataPagamento, "2024-01-15");
});
