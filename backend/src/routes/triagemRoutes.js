import express from "express";
import { triagemController } from "../controllers/triagemController.js";
import { auth, onlyProfessional } from "../middleware/auth.js";

const router = express.Router();

router.post("/registrar", auth, onlyProfessional, triagemController.registrar);
router.get("/all", auth, onlyProfessional, triagemController.listar);

export default router;
