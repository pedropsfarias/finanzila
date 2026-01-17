import db from "../../../config/db.js";
import seedUsuarioAdmin from "./usuario-admin.js";

const runSeeds = async () => {
  await seedUsuarioAdmin();
};

runSeeds()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.close();
  });
