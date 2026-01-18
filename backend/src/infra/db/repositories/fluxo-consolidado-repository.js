import db from "../../../config/db.js";

const fluxoConsolidadoRepository = {
  create: async ({ mesReferencia, data, descricao, valorEstimado, dataPagamento, valorPagamento }) => {
    const query = `
      INSERT INTO fluxo_consolidado (
        mes_referencia,
        data,
        descricao,
        valor_estimado,
        data_pagamento,
        valor_pagamento
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        id,
        mes_referencia AS "mesReferencia",
        data,
        descricao,
        valor_estimado AS "valorEstimado",
        data_pagamento AS "dataPagamento",
        valor_pagamento AS "valorPagamento",
        criado_em AS "criadoEm",
        atualizado_em AS "atualizadoEm";
    `;

    const result = await db.query(query, [
      mesReferencia,
      data,
      descricao,
      valorEstimado,
      dataPagamento,
      valorPagamento
    ]);
    return result.rows[0];
  },
  list: async ({ mesReferencia } = {}) => {
    const hasMesReferencia = Boolean(mesReferencia);
    const query = `
      SELECT
        id,
        mes_referencia AS "mesReferencia",
        data,
        descricao,
        valor_estimado AS "valorEstimado",
        data_pagamento AS "dataPagamento",
        valor_pagamento AS "valorPagamento",
        criado_em AS "criadoEm",
        atualizado_em AS "atualizadoEm"
      FROM fluxo_consolidado
      ${hasMesReferencia ? "WHERE mes_referencia = $1" : ""}
      ORDER BY data ASC, id ASC;
    `;

    const result = await db.query(query, hasMesReferencia ? [mesReferencia] : []);
    return result.rows;
  },
  update: async ({
    id,
    mesReferencia,
    data,
    descricao,
    valorEstimado,
    dataPagamento,
    valorPagamento
  }) => {
    const query = `
      UPDATE fluxo_consolidado
      SET mes_referencia = $1,
          data = $2,
          descricao = $3,
          valor_estimado = $4,
          data_pagamento = $5,
          valor_pagamento = $6,
          atualizado_em = now()
      WHERE id = $7
      RETURNING
        id,
        mes_referencia AS "mesReferencia",
        data,
        descricao,
        valor_estimado AS "valorEstimado",
        data_pagamento AS "dataPagamento",
        valor_pagamento AS "valorPagamento",
        criado_em AS "criadoEm",
        atualizado_em AS "atualizadoEm";
    `;

    const result = await db.query(query, [
      mesReferencia,
      data,
      descricao,
      valorEstimado,
      dataPagamento,
      valorPagamento,
      id
    ]);
    return result.rows[0] ?? null;
  },
  remove: async (id) => {
    const query = `
      DELETE FROM fluxo_consolidado
      WHERE id = $1
      RETURNING id;
    `;

    const result = await db.query(query, [id]);
    return result.rows[0] ?? null;
  },
  removeByMesReferencia: async (mesReferencia) => {
    const query = `
      DELETE FROM fluxo_consolidado
      WHERE mes_referencia = $1;
    `;

    await db.query(query, [mesReferencia]);
  }
};

export default fluxoConsolidadoRepository;
