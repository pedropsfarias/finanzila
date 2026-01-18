import { readFileSync } from "node:fs";

const DELIMITER = ";";
const REQUIRED_HEADERS = ["date", "title", "amount"];
const CARTAO_NUBANK = "Nubank";

const parseCsvLine = (line) => {
  const values = [];
  let current = "";
  let inQuotes = false;
  for (let idx = 0; idx < line.length; idx += 1) {
    const char = line[idx];
    if (char === "\"") {
      if (inQuotes && line[idx + 1] === "\"") {
        current += "\"";
        idx += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === DELIMITER && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  values.push(current);
  return values;
};

const findHeader = (lines) => {
  for (let idx = 0; idx < lines.length; idx += 1) {
    const line = String(lines[idx] ?? "").trim();
    if (!line) {
      continue;
    }
    const values = parseCsvLine(line).map((value) => String(value ?? "").trim().toLowerCase());
    if (values.length) {
      values[0] = values[0].replace(/^\uFEFF/, "");
    }
    const indexes = REQUIRED_HEADERS.reduce((acc, header) => {
      const position = values.indexOf(header);
      if (position >= 0) {
        acc[header] = position;
      }
      return acc;
    }, {});
    const hasAll = REQUIRED_HEADERS.every((header) => header in indexes);
    if (hasAll) {
      return { headerIndex: idx, indexes };
    }
    return null;
  }
  return null;
};

const extractParcela = (descricao) => {
  const text = String(descricao ?? "");
  const match = text.match(/\b(\d+)\s*\/\s*(\d+)\b/);
  return match ? `${match[1]}/${match[2]}` : null;
};

const parseFluxoCaixaCsvNubank = (filePath) => {
  const content = readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  const header = findHeader(lines);
  if (!header) {
    return [];
  }
  const { headerIndex, indexes } = header;
  const records = [];
  for (let idx = headerIndex + 1; idx < lines.length; idx += 1) {
    const line = String(lines[idx] ?? "");
    if (!line.trim()) {
      continue;
    }
    const values = parseCsvLine(line);
    const data = values[indexes.date] ?? "";
    const titulo = values[indexes.title] ?? "";
    const valor = values[indexes.amount] ?? "";
    const record = {
      linha: idx + 1,
      data: String(data ?? "").trim(),
      descricao: String(titulo ?? "").trim(),
      conta: "",
      cartaoCredito: CARTAO_NUBANK,
      valor: String(valor ?? "").trim()
    };
    const parcela = extractParcela(record.descricao);
    if (parcela) {
      record.parcela = parcela;
    }
    if (!record.data && !record.descricao && !record.valor) {
      continue;
    }
    records.push(record);
  }
  return records;
};

const isCsvNubank = (filePath) => {
  const content = readFileSync(filePath, "utf8");
  return Boolean(findHeader(content.split(/\r?\n/)));
};

const csvNubankStrategy = {
  id: "csv_nubank",
  requiresCarteira: true,
  match: ({ filePath }) => isCsvNubank(filePath),
  parse: ({ filePath }) => parseFluxoCaixaCsvNubank(filePath)
};

export default csvNubankStrategy;
