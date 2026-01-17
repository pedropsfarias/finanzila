import "dotenv/config";
import { defineConfig } from "pgkit/config";

const databaseUrl = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/finanzila";

console.log("[pgkit] connectionString:", databaseUrl);

export default defineConfig({
  client: {
    connectionString: databaseUrl
  },
  migrator: {
    migrationsPath: "src/infra/db/migrations",
    migrationTableName: "pgkit_migrations"
  }
});
