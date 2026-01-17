import db from "../../../config/db.js";

const userRepository = {
  create: async ({ email, name, passwordHash }) => {
    const query = `
      INSERT INTO users (email, name, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, email, name, created_at AS "createdAt", updated_at AS "updatedAt";
    `;

    const result = await db.query(query, [email, name, passwordHash]);
    return result.rows[0];
  },
  list: async () => {
    const query = `
      SELECT id, email, name, created_at AS "createdAt", updated_at AS "updatedAt"
      FROM users
      ORDER BY id DESC;
    `;

    const result = await db.query(query);
    return result.rows;
  },
  findById: async (id) => {
    const query = `
      SELECT id, email, name, created_at AS "createdAt", updated_at AS "updatedAt"
      FROM users
      WHERE id = $1;
    `;

    const result = await db.query(query, [id]);
    return result.rows[0] ?? null;
  },
  findByEmail: async (email) => {
    const query = `
      SELECT id, email, name, password_hash AS "passwordHash", created_at AS "createdAt", updated_at AS "updatedAt"
      FROM users
      WHERE email = $1;
    `;

    const result = await db.query(query, [email]);
    return result.rows[0] ?? null;
  },
  update: async ({ id, email, name, passwordHash }) => {
    const query = `
      UPDATE users
      SET email = $1,
          name = $2,
          password_hash = COALESCE($3, password_hash),
          updated_at = now()
      WHERE id = $4
      RETURNING id, email, name, created_at AS "createdAt", updated_at AS "updatedAt";
    `;

    const result = await db.query(query, [email, name, passwordHash, id]);
    return result.rows[0] ?? null;
  },
  remove: async (id) => {
    const query = `
      DELETE FROM users
      WHERE id = $1
      RETURNING id;
    `;

    const result = await db.query(query, [id]);
    return result.rows[0] ?? null;
  }
};

export default userRepository;
