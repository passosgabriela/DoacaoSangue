import express from "express";
import { appointmentController } from "../controllers/appointmentController.js";
import { auth, onlyUser } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", auth, onlyUser, appointmentController.criar);
router.post("/confirmar/:id", auth, onlyUser, appointmentController.confirmar);
router.post("/cancelar/:id", auth, onlyUser, appointmentController.cancelar);
router.get("/meus", auth, onlyUser, appointmentController.meusAgendamentos);

export default router;
