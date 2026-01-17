import { Router } from "express";
import usersController from "../controllers/users-controller.js";

const router = Router();

router.get("/users", usersController.list);
router.get("/users/:id", usersController.get);
router.post("/users", usersController.create);
router.put("/users/:id", usersController.update);
router.delete("/users/:id", usersController.remove);

export default router;
