import express from "express";
import { campanhaController } from "../controllers/campanhaController.js";
import { auth, onlyAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/criar", auth, onlyAdmin, campanhaController.criar);
router.put("/:id", auth, onlyAdmin, campanhaController.atualizar);
router.delete("/:id", auth, onlyAdmin, campanhaController.remover);
router.get("/", campanhaController.listar);

export default router;
