import db from "../../../config/db.js";

const despesasRepository = {
  create: async ({ dia, descricao, valorEstimado }) => {
    const query = `
      INSERT INTO despesas (dia, descricao, valor_estimado)
      VALUES ($1, $2, $3)
      RETURNING id, dia, descricao, valor_estimado AS "valorEstimado", criado_em AS "criadoEm", atualizado_em AS "atualizadoEm";
    `;

    const result = await db.query(query, [dia, descricao, valorEstimado]);
    return result.rows[0];
  },
  list: async () => {
    const query = `
      SELECT id, dia, descricao, valor_estimado AS "valorEstimado", criado_em AS "criadoEm", atualizado_em AS "atualizadoEm"
      FROM despesas
      ORDER BY id DESC;
    `;

    const result = await db.query(query);
    return result.rows;
  },
  update: async ({ id, dia, descricao, valorEstimado }) => {
    const query = `
      UPDATE despesas
      SET dia = $1,
          descricao = $2,
          valor_estimado = $3,
          atualizado_em = now()
      WHERE id = $4
      RETURNING id, dia, descricao, valor_estimado AS "valorEstimado", criado_em AS "criadoEm", atualizado_em AS "atualizadoEm";
    `;

    const result = await db.query(query, [dia, descricao, valorEstimado, id]);
    return result.rows[0] ?? null;
  },
  remove: async (id) => {
    const query = `
      DELETE FROM despesas
      WHERE id = $1
      RETURNING id;
    `;

    const result = await db.query(query, [id]);
    return result.rows[0] ?? null;
  }
};

export default despesasRepository;
