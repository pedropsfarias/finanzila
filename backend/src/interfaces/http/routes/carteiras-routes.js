import { Router } from "express";
import carteirasController from "../controllers/carteiras-controller.js";

const router = Router();

router.get("/carteiras", carteirasController.list);
router.post("/carteiras", carteirasController.create);
router.put("/carteiras/:id", carteirasController.update);
router.delete("/carteiras/:id", carteirasController.remove);

export default router;
