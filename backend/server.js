import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./src/routes/userRoutes.js";
import appointmentRoutes from "./src/routes/appointmentRoutes.js";
import donationRoutes from "./src/routes/donationRoutes.js";
import triagemRoutes from "./src/routes/triagemRoutes.js";
import profissionalRoutes from "./src/routes/profissionalRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import campanhaRoutes from "./src/routes/campanhaRoutes.js";
import sistemaRoutes from "./src/routes/sistemaRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use("/users", userRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/donations", donationRoutes);
app.use("/triagem", triagemRoutes);
app.use("/profissionais", profissionalRoutes);
app.use("/admin", adminRoutes);
app.use("/campanha", campanhaRoutes);
app.use("/sistema", sistemaRoutes);

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});