import xlsx from "xlsx";

const extractRecords = (rows) => {
  const headerKeys = {
    Data: null,
    "Título": null,
    Conta: null,
    "Cartão de crédito": null,
    Valor: null
  };
  let headerIndex = null;
  for (let idx = 0; idx < rows.length; idx += 1) {
    const values = rows[idx] ?? [];
    if (values.includes("Data") && values.includes("Título")) {
      headerIndex = idx;
      values.forEach((value, colIndex) => {
        if (value in headerKeys) {
          headerKeys[value] = colIndex;
        }
      });
      break;
    }
  }
  if (headerIndex === null) {
    return [];
  }
  const records = [];
  rows.slice(headerIndex + 1).forEach((row, index) => {
    const data = row?.[headerKeys.Data] ?? "";
    const titulo = row?.[headerKeys["Título"]] ?? "";
    const conta = row?.[headerKeys.Conta] ?? "";
    const cartao = row?.[headerKeys["Cartão de crédito"]] ?? "";
    const valor = row?.[headerKeys.Valor] ?? "";
    const record = {
      linha: headerIndex + 2 + index,
      data: String(data ?? "").trim(),
      descricao: String(titulo ?? "").trim(),
      conta: String(conta ?? "").trim(),
      cartaoCredito: String(cartao ?? "").trim(),
      valor: String(valor ?? "").trim()
    };
    if (!record.data && !record.descricao && !record.valor) {
      return;
    }
    records.push(record);
  });
  return records;
};

const parseFluxoCaixaXlsx = (filePath) => {
  const workbook = xlsx.readFile(filePath, { cellDates: false });
  const sheetName = workbook.SheetNames?.[0];
  if (!sheetName) {
    return [];
  }
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  return extractRecords(rows);
};

export default parseFluxoCaixaXlsx;
