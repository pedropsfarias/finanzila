import db from "../../../config/db.js";

const despesasRepository = {
  create: async ({ dia, descricao, valorEstimado }) => {
    const query = `
      INSERT INTO despesas (dia, descricao, valor_estimado)
      VALUES ($1, $2, $3)
      RETURNING id, dia, descricao, valor_estimado AS "valorEstimado";
    `;

    const result = await db.query(query, [dia, descricao, valorEstimado]);
    return result.rows[0];
  },
  list: async () => {
    const query = `
      SELECT id, dia, descricao, valor_estimado AS "valorEstimado"
      FROM despesas
      ORDER BY id DESC;
    `;

    const result = await db.query(query);
    return result.rows;
  }
};

export default despesasRepository;
