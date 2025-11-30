// backend/src/controllers/agendamentoController.js
import { db } from "../config/db.js";

export const appointmentController = {
  
  // Criar agendamento usando PROCEDURE
  criar: async (req, res) => {
    try {
      const usuarioId = req.userId;
      const { data, horario, campanha_id } = req.body;

      // campanha_id pode ser null → backend não interfere mais
      const campanha = campanha_id || null;

      await db.query("CALL registrar_agendamento(?, ?, ?, ?)", [
        usuarioId,
        data,
        horario,
        campanha
      ]);

      res.json({ message: "Agendamento criado com sucesso" });

    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Listar agendamentos do usuário via VIEW
  meusAgendamentos: async (req, res) => {
    try {
      const usuarioId = req.userId;

      const [rows] = await db.query(
        "SELECT * FROM vw_agendamentos WHERE usuario_id = ? ORDER BY data_agendamento DESC",
        [usuarioId]
      );

      res.json(rows);

    } catch (err) {
      res.status(500).json(err);
    }
  }
};
