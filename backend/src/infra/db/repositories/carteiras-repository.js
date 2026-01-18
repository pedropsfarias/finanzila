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
  },
  update: async ({ id, nome, aliases, diaFechamento, diaPagamento }) => {
    const query = `
      UPDATE carteiras
      SET nome = $1,
          aliases = $2,
          dia_fechamento = $3,
          dia_pagamento = $4,
          atualizado_em = now()
      WHERE id = $5
      RETURNING id, nome, aliases, dia_fechamento AS "diaFechamento", dia_pagamento AS "diaPagamento", criado_em AS "criadoEm", atualizado_em AS "atualizadoEm";
    `;

    const result = await db.query(query, [nome, aliases, diaFechamento, diaPagamento, id]);
    return result.rows[0] ?? null;
  },
  remove: async (id) => {
    const query = `
      DELETE FROM carteiras
      WHERE id = $1
      RETURNING id;
    `;

    const result = await db.query(query, [id]);
    return result.rows[0] ?? null;
  }
};

export default carteirasRepository;
