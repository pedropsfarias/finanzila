import { createPool } from "pgkit/client";
import env from "./env.js";

const pool = createPool(env.databaseUrl);

const db = {
  query: (text, params) => pool.query(pool.sql.raw(text, params ?? [])),
  close: () => pool.end()
};

export default db;
