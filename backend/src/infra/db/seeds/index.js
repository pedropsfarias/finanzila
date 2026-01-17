import db from "../../../config/db.js";
import seedAdminUser from "./admin-user.js";

const runSeeds = async () => {
  await seedAdminUser();
};

runSeeds()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.close();
  });
