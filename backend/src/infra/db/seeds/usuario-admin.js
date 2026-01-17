import bcrypt from "bcryptjs";
import db from "../../../config/db.js";

const seedUsuarioAdmin = async () => {
  const passwordHash = await bcrypt.hash("admin", 10);
  const query = `
    INSERT INTO usuarios (email, nome, senha_hash)
    VALUES ($1, $2, $3)
    ON CONFLICT (email)
    DO UPDATE SET
      nome = EXCLUDED.nome,
      senha_hash = EXCLUDED.senha_hash,
      atualizado_em = now();
  `;

  await db.query(query, ["admin", "Administrador", passwordHash]);
};

export default seedUsuarioAdmin;
