import express from "express";
import { donationController } from "../controllers/donationController.js";
import { auth, onlyProfessional } from "../middleware/auth.js";

const router = express.Router();

// Registrar doação (futuro: proteger com role admin/profissional)
router.post("/register", auth, donationController.registrarManual);

// listar minhas doações
router.get("/meus", auth, donationController.minhasDoacoes);

router.get("/profissional", auth, onlyProfessional, donationController.listarTodas);

export default router;
