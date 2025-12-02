import express from "express";
import { adminController } from "../controllers/adminController.js";
import { auth, onlyAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", auth, onlyAdmin, adminController.register);
router.post("/login", adminController.login);

export default router;
