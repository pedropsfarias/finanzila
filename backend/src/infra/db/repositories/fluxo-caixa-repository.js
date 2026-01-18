import db from "../../../config/db.js";

const fluxoCaixaRepository = {
  create: async ({ data, descricao, valor, parcela, carteiraId }) => {
    const query = `
      INSERT INTO fluxo_caixa (data, descricao, valor, parcela, carteira_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, data, descricao, valor, parcela, carteira_id AS "carteiraId", criado_em AS "criadoEm", atualizado_em AS "atualizadoEm";
    `;

    const result = await db.query(query, [data, descricao, valor, parcela, carteiraId]);
    return result.rows[0];
  },
  findExisting: async ({ data, descricao, valor, parcela, carteiraId }) => {
    const query = `
      SELECT id
      FROM fluxo_caixa
      WHERE data = $1
        AND descricao = $2
        AND valor = $3
        AND carteira_id = $4
        AND parcela IS NOT DISTINCT FROM $5
      LIMIT 1;
    `;

    const result = await db.query(query, [data, descricao, valor, carteiraId, parcela]);
    return result.rows[0] ?? null;
  },
  list: async () => {
    const query = `
      SELECT id, data, descricao, valor, parcela, carteira_id AS "carteiraId", criado_em AS "criadoEm", atualizado_em AS "atualizadoEm"
      FROM fluxo_caixa
      ORDER BY data DESC, id DESC;
    `;

    const result = await db.query(query);
    return result.rows;
  }
};

export default fluxoCaixaRepository;
