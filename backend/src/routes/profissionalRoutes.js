import express from "express";
import { profissionalController } from "../controllers/profissionalController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", profissionalController.cadastrar);
router.post("/login", profissionalController.login);
router.get("/me", auth, profissionalController.me);

export default router;
