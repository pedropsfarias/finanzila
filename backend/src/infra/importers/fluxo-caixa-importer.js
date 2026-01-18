import csvNubankStrategy from "./fluxo-caixa-strategies/csv-nubank.js";
import xlsxDespezzasStrategy from "./fluxo-caixa-strategies/xlsx-despezzas.js";

const fluxoCaixaImportStrategies = [
  xlsxDespezzasStrategy,
  csvNubankStrategy
];

const resolveFluxoCaixaImportStrategy = ({ filePath, fileName }) => {
  return fluxoCaixaImportStrategies.find((strategy) => strategy.match({ filePath, fileName })) ?? null;
};

const parseFluxoCaixaFile = ({ filePath, fileName }) => {
  const strategy = resolveFluxoCaixaImportStrategy({ filePath, fileName });
  if (!strategy) {
    return { strategy: null, registros: [] };
  }
  const registros = strategy.parse({ filePath, fileName });
  return { strategy, registros };
};

export {
  fluxoCaixaImportStrategies,
  parseFluxoCaixaFile,
  resolveFluxoCaixaImportStrategy
};
