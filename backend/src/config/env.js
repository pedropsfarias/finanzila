import "dotenv/config";

const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/finanzila",
  jwtSecret: process.env.JWT_SECRET ?? "change-me"
};

export default env;
