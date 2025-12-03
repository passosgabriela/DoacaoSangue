import express from "express";
import { profissionalController } from "../controllers/profissionalController.js";
import { auth, onlyProfessional, onlyAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", profissionalController.listar);
router.post("/register", auth, onlyAdmin, profissionalController.cadastrar);
router.post("/login", profissionalController.login);

export default router;
