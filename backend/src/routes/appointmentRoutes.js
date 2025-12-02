import express from "express";
import { appointmentController } from "../controllers/appointmentController.js";
import { auth } from "../middleware/auth.js";
import { onlyUser } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", auth, onlyUser, appointmentController.criar);
router.get("/meus", auth, onlyUser, appointmentController.meusAgendamentos);

export default router;
