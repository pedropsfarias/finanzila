import db from "../../../config/db.js";

const carteirasRepository = {
  create: async ({ nome, diaFechamento, diaPagamento }) => {
    const query = `
      INSERT INTO carteiras (nome, dia_fechamento, dia_pagamento)
      VALUES ($1, $2, $3)
      RETURNING id, nome, dia_fechamento AS "diaFechamento", dia_pagamento AS "diaPagamento";
    `;

    const result = await db.query(query, [nome, diaFechamento, diaPagamento]);
    return result.rows[0];
  },
  list: async () => {
    const query = `
      SELECT id, nome, dia_fechamento AS "diaFechamento", dia_pagamento AS "diaPagamento"
      FROM carteiras
      ORDER BY id DESC;
    `;

    const result = await db.query(query);
    return result.rows;
  }
};

export default carteirasRepository;
