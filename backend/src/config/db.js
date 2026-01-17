import { createPool } from "pgkit";
import env from "./env.js";

const pool = createPool({
  connectionString: env.databaseUrl
});

const db = {
  query: (text, params) => pool.query(text, params),
  close: () => pool.end()
};

export default db;
