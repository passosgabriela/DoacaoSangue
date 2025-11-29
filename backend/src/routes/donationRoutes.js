import express from "express";
import { donationController } from "../controllers/donationController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Registrar doação (futuro: proteger com role admin/profissional)
router.post("/register", auth, donationController.register);

// listar minhas doações
router.get("/meus", auth, donationController.listByUser);

export default router;
