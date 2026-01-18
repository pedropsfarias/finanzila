import { Router } from "express";
import fluxoCaixaController from "../controllers/fluxo-caixa-controller.js";

const router = Router();

router.get("/fluxo-caixa", fluxoCaixaController.list);
router.post("/fluxo-caixa", fluxoCaixaController.create);
router.put("/fluxo-caixa/:id", fluxoCaixaController.update);
router.delete("/fluxo-caixa/:id", fluxoCaixaController.remove);
router.post("/fluxo-caixa/import", fluxoCaixaController.importXlsx);

export default router;
