import express from "express";
import { userController } from "../controllers/userController.js";
import { auth, onlyUser } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/me", auth, onlyUser, userController.me);
router.put("/me", auth, onlyUser, userController.atualizarPerfil);

export default router;
