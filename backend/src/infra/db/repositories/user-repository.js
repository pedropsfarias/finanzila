import db from "../../../config/db.js";

const userRepository = {
  create: async ({ email, name, passwordHash }) => {
    const query = `
      INSERT INTO usuarios (email, nome, senha_hash)
      VALUES ($1, $2, $3)
      RETURNING id, email, nome AS "name", criado_em AS "criadoEm", atualizado_em AS "atualizadoEm";
    `;

    const result = await db.query(query, [email, name, passwordHash]);
    return result.rows[0];
  },
  list: async () => {
    const query = `
      SELECT id, email, nome AS "name", criado_em AS "criadoEm", atualizado_em AS "atualizadoEm"
      FROM usuarios
      ORDER BY id DESC;
    `;

    const result = await db.query(query);
    return result.rows;
  },
  findById: async (id) => {
    const query = `
      SELECT id, email, nome AS "name", criado_em AS "criadoEm", atualizado_em AS "atualizadoEm"
      FROM usuarios
      WHERE id = $1;
    `;

    const result = await db.query(query, [id]);
    return result.rows[0] ?? null;
  },
  findByEmail: async (email) => {
    const query = `
      SELECT id, email, nome AS "name", senha_hash AS "passwordHash", criado_em AS "criadoEm", atualizado_em AS "atualizadoEm"
      FROM usuarios
      WHERE email = $1;
    `;

    const result = await db.query(query, [email]);
    return result.rows[0] ?? null;
  },
  update: async ({ id, email, name, passwordHash }) => {
    const query = `
      UPDATE usuarios
      SET email = $1,
          nome = $2,
          senha_hash = COALESCE($3, senha_hash),
          atualizado_em = now()
      WHERE id = $4
      RETURNING id, email, nome AS "name", criado_em AS "criadoEm", atualizado_em AS "atualizadoEm";
    `;

    const result = await db.query(query, [email, name, passwordHash, id]);
    return result.rows[0] ?? null;
  },
  remove: async (id) => {
    const query = `
      DELETE FROM usuarios
      WHERE id = $1
      RETURNING id;
    `;

    const result = await db.query(query, [id]);
    return result.rows[0] ?? null;
  }
};

export default userRepository;
