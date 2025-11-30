import express from "express";
import { agendamentoController } from "../controllers/appointmentController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", auth, onlyUser, agendamentoController.criar);
router.get("/meus", auth, onlyUser, agendamentoController.meusAgendamentos);

export default router;
