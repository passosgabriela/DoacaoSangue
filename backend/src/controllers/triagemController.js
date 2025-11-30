import { db } from "../config/db.js";

export const triagemController = {

  registrar: async (req, res) => {
    try {
      const profissionalId = req.profissionalId;

      const {
        agendamento_id,
        pressao,
        batimentos,
        temperatura,
        observacoes,
        status
      } = req.body;

      await db.query("CALL registrar_triagem(?, ?, ?, ?, ?, ?, ?)", [
        agendamento_id,
        profissionalId,
        pressao,
        batimentos,
        temperatura,
        observacoes,
        status
      ]);

      res.json({ message: "Triagem registrada com sucesso" });

    } catch (err) {
      res.status(500).json(err);
    }
  },

  listar: async (req, res) => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM vw_triagens ORDER BY id DESC"
      );

      res.json(rows);

    } catch (err) {
      res.status(500).json(err);
    }
  }
};
