import { Router } from "express";
import fluxoCaixaController from "../controllers/fluxo-caixa-controller.js";

const router = Router();

router.get("/fluxo-caixa", fluxoCaixaController.list);
router.post("/fluxo-caixa", fluxoCaixaController.create);
router.post("/fluxo-caixa/import", fluxoCaixaController.importXlsx);

export default router;
