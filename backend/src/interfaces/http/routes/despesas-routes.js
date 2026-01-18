import { Router } from "express";
import despesasController from "../controllers/despesas-controller.js";

const router = Router();

router.get("/despesas", despesasController.list);
router.post("/despesas", despesasController.create);
router.put("/despesas/:id", despesasController.update);
router.delete("/despesas/:id", despesasController.remove);

export default router;
