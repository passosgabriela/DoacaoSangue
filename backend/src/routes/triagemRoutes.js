import express from "express";
import { auth } from "../middleware/auth.js";
import { triagemController } from "../controllers/triagemController.js";
import { onlyProfessional } from "../middleware/onlyProfessional.js";

const router = express.Router();

// registrar triagem
router.post("/registrar", auth, onlyProfessional, triagemController.registrar);


// pegar triagem de um agendamento específico
router.get("/:id", auth, onlyProfessional, triagemController.porAgendamento);

// backend/src/routes/triagemRoutes.js
router.get("/all", auth, onlyProfessional, triagemController.all);

export default router;
