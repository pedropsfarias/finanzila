import env from "./config/env.js";
import app from "./interfaces/http/server.js";

app.listen(env.port, () => {
  console.log(`[finanzila] api listening on port ${env.port}`);
});
