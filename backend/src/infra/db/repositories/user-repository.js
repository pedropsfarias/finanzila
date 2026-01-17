import db from "../../../config/db.js";

const userRepository = {
  create: async ({ email, name }) => {
    const query = `
      INSERT INTO users (email, name)
      VALUES ($1, $2)
      RETURNING id, email, name, created_at AS "createdAt", updated_at AS "updatedAt";
    `;

    const result = await db.query(query, [email, name]);
    return result.rows[0];
  }
};

export default userRepository;
