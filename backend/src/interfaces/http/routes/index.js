import { Router } from "express";
import healthController from "../controllers/health-controller.js";
import despesasRoutes from "./despesas-routes.js";
import carteirasRoutes from "./carteiras-routes.js";
import fluxoCaixaRoutes from "./fluxo-caixa-routes.js";
import usersRoutes from "./users-routes.js";
import authRoutes from "./auth-routes.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

router.use(authRoutes);
router.use(authMiddleware);
router.get("/health", healthController.handle);
router.use(usersRoutes);
router.use(despesasRoutes);
router.use(carteirasRoutes);
router.use(fluxoCaixaRoutes);

export default router;
