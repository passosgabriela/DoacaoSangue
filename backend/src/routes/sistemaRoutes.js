import { Router } from "express";
import { db } from "../config/db.js";
import { auth, onlyAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/resumo", auth, onlyAdmin, async (req, res) => {
  try {
    // Usar os nomes reais das tabelas do seu esquema (usuarios, agendamentos, campanhas, profissionais)
    const [[doacoes]] = await db.query("SELECT COUNT(*) AS total FROM doacoes");
    const [[agendamentos]] = await db.query("SELECT COUNT(*) AS total FROM agendamentos");
    const [[triagens]] = await db.query("SELECT COUNT(*) AS total FROM triagens");

    res.json({
    doacoes: doacoes.total,       
    triagens: triagens.total,  
    agendamentos: agendamentos.total
    });

  } catch (err) {
    console.error("Erro /sistema/resumo:", err);
    res.status(500).json({ message: "Erro ao gerar resumo", error: err.message || err });
  }
});

export default router;
