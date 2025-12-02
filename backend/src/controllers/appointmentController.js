import { db } from "../config/db.js";

export const appointmentController = {
  
  criar: async (req, res) => {
    try {
      const usuarioId = req.userId;
      const { data, horario, campanha_id } = req.body;

      await db.query("CALL registrar_agendamento(?, ?, ?, ?)", [
        usuarioId,
        data,
        horario,
        campanha_id || null
      ]);

      res.json({ message: "Agendamento criado com sucesso" });

    } catch (err) {
      res.status(500).json({ error: err.sqlMessage || err });
    }
  },

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
  },

  confirmar: async (req, res) => {
    try {
      const { id } = req.params;

      await db.query("CALL confirmar_agendamento(?)", [id]);

      res.json({ message: "Agendamento confirmado" });

    } catch (err) {
      res.status(500).json(err);
    }
  },

  cancelar: async (req, res) => {
    try {
      const { id } = req.params;

      await db.query("CALL cancelar_agendamento(?)", [id]);

      res.json({ message: "Agendamento cancelado" });

    } catch (err) {
      res.status(500).json(err);
    }
  }
};
