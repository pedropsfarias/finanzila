import bcrypt from "bcryptjs";
import db from "../../../config/db.js";

const seedAdminUser = async () => {
  const passwordHash = await bcrypt.hash("admin", 10);
  const query = `
    INSERT INTO users (email, name, password_hash)
    VALUES ($1, $2, $3)
    ON CONFLICT (email)
    DO UPDATE SET
      name = EXCLUDED.name,
      password_hash = EXCLUDED.password_hash,
      updated_at = now();
  `;

  await db.query(query, ["admin", "Administrador", passwordHash]);
};

export default seedAdminUser;
