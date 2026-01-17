import { Router } from "express";
import despesasController from "../controllers/despesas-controller.js";

const router = Router();

router.get("/despesas", despesasController.list);
router.post("/despesas", despesasController.create);

export default router;
