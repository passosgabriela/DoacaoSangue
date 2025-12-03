import { db } from "../config/db.js";

export const donationController = {

  minhasDoacoes: async (req, res) => {
    try {
      const usuarioId = req.userId;

      const [rows] = await db.query(
        "SELECT * FROM vw_doacoes WHERE usuario_id = ? ORDER BY data_doacao DESC",
        [usuarioId]
      );

      res.json(rows);

    } catch (err) {
      res.status(500).json(err);
    }
  },

  registrarManual: async (req, res) => {
    try {
      const {
        agendamento_id,
        usuario_id,
        data_doacao,
        volume_coletado,
        tipo_sanguineo,
        campanha_id
      } = req.body;

      await db.query("CALL registrar_doacao(?, ?, ?, ?, ?, ?)", [
        agendamento_id,
        usuario_id,
        data_doacao,
        volume_coletado,
        tipo_sanguineo,
        campanha_id || null
      ]);

      res.json({ message: "Doação registrada manualmente" });

    } catch (err) {
      res.status(500).json(err);
    }
  },
  
  listarTodas: async (req, res) => {
    try {
      const [rows] = await db.query(`
      SELECT * FROM vw_doacoes
      ORDER BY data_doacao DESC
    `);

      res.json(rows);

    } catch (err) {
      res.status(500).json(err);
    }
  }
};
