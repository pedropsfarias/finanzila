import path from "node:path";
import parseFluxoCaixaXlsx, { isFluxoCaixaXlsx } from "../fluxo-caixa-xlsx.js";

const hasXlsxExtension = (fileName, filePath) => {
  const target = fileName || filePath || "";
  return path.extname(target).toLowerCase() === ".xlsx";
};

const xlsxDespezzasStrategy = {
  id: "xlsx_despezzas",
  requiresCarteira: false,
  match: ({ filePath, fileName }) => hasXlsxExtension(fileName, filePath)
    && isFluxoCaixaXlsx(filePath),
  parse: ({ filePath }) => parseFluxoCaixaXlsx(filePath)
};

export default xlsxDespezzasStrategy;
