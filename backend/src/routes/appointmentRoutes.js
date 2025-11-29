import express from "express";
import { auth } from "../middleware/auth.js";
import { appointmentController } from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/create", auth, appointmentController.create);
router.get("/meus", auth, appointmentController.listByUser);

export default router;
