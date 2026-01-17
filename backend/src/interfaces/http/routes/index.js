import { Router } from "express";
import healthController from "../controllers/health-controller.js";
import despesasRoutes from "./despesas-routes.js";
import carteirasRoutes from "./carteiras-routes.js";
import fluxoCaixaRoutes from "./fluxo-caixa-routes.js";

const router = Router();

router.get("/health", healthController.handle);
router.use(despesasRoutes);
router.use(carteirasRoutes);
router.use(fluxoCaixaRoutes);

export default router;
