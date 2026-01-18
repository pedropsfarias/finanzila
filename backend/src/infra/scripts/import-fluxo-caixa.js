import parseFluxoCaixaXlsx from "../importers/fluxo-caixa-xlsx.js";
import importFluxoCaixaUseCase from "../../application/usecases/import-fluxo-caixa.js";
import fluxoCaixaRepository from "../db/repositories/fluxo-caixa-repository.js";
import carteirasRepository from "../db/repositories/carteiras-repository.js";
import db from "../../config/db.js";

const filePath = process.argv[2];

if (!filePath) {
  console.error("Uso: node src/infra/scripts/import-fluxo-caixa.js <caminho-da-planilha>");
  process.exit(1);
}

const registros = parseFluxoCaixaXlsx(filePath);
const resultado = await importFluxoCaixaUseCase(
  { fluxoCaixaRepository, carteirasRepository },
  { registros }
);

console.log(`[importacao] registros: ${resultado.totalRegistros}`);
console.log(`[importacao] importados: ${resultado.importados}`);
console.log(`[importacao] carteiras criadas: ${resultado.carteirasCriadas}`);
console.log(`[importacao] repetidos: ${resultado.repetidos.length}`);
console.log(`[importacao] ignorados: ${resultado.ignorados.length}`);

if (resultado.repetidos.length) {
  console.log("[importacao] resumo dos repetidos:");
  resultado.repetidos.slice(0, 20).forEach((item) => {
    const carteira = item.conta || item.cartaoCredito || "-";
    console.log(
      `- linha ${item.linha}: ${item.data} | ${item.descricao} | ${carteira} | ${item.valor} (${item.motivo})`
    );
  });
  if (resultado.repetidos.length > 20) {
    console.log(`...e mais ${resultado.repetidos.length - 20} repetidos.`);
  }
}

await db.close();
