import db from "../../../config/db.js";

const carteirasRepository = {
  create: async ({ nome, aliases, diaFechamento, diaPagamento }) => {
    const query = `
      INSERT INTO carteiras (nome, aliases, dia_fechamento, dia_pagamento)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nome, aliases, dia_fechamento AS "diaFechamento", dia_pagamento AS "diaPagamento", criado_em AS "criadoEm", atualizado_em AS "atualizadoEm";
    `;

    const result = await db.query(query, [nome, aliases, diaFechamento, diaPagamento]);
    return result.rows[0];
  },
  list: async () => {
    const query = `
      SELECT id, nome, aliases, dia_fechamento AS "diaFechamento", dia_pagamento AS "diaPagamento", criado_em AS "criadoEm", atualizado_em AS "atualizadoEm"
      FROM carteiras
      ORDER BY id DESC;
    `;

    const result = await db.query(query);
    return result.rows;
  }
};

export default carteirasRepository;
