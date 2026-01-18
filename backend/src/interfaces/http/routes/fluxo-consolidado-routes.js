import { Router } from "express";
import fluxoConsolidadoController from "../controllers/fluxo-consolidado-controller.js";

const router = Router();

router.get("/fluxo-consolidado", fluxoConsolidadoController.list);
router.post("/fluxo-consolidado", fluxoConsolidadoController.create);
router.put("/fluxo-consolidado/:id", fluxoConsolidadoController.update);
router.delete("/fluxo-consolidado/:id", fluxoConsolidadoController.remove);
router.post("/fluxo-consolidado/generate", fluxoConsolidadoController.generate);

export default router;
