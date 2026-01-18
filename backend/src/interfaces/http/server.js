import express from "express";
import env from "../../config/env.js";
import routes from "./routes/index.js";

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", env.corsOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization,Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).send();
  }

  return next();
});

app.use(express.json({ limit: "15mb" }));
app.use(routes);
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "internal server error" });
});

export default app;
