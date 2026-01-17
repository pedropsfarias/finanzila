const databaseUrl = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/finanzila";

export default {
  migrationsDir: "src/infra/db/migrations",
  connectionString: databaseUrl
};
