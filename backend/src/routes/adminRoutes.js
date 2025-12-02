import express from "express";
import { adminController } from "../controllers/adminController.js";
import { auth, onlyAdmin } from "../middleware/auth.js";

const router = express.Router();

// criar admin — apenas outro admin pode criar
router.post("/register", auth, onlyAdmin, adminController.registrar);

// login admin
router.post("/login", adminController.login);

// listar admins
router.get("/", auth, onlyAdmin, adminController.listar);

// atualizar admin
router.put("/:id", auth, onlyAdmin, adminController.atualizar);

// remover admin
router.delete("/:id", auth, onlyAdmin, adminController.remover);

export default router;
