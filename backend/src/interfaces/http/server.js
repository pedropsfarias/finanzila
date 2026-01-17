import express from "express";
import routes from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(routes);
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "internal server error" });
});

export default app;
