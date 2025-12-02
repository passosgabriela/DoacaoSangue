import { db } from "../config/db.js";

export const campanhaController = {

  criar: async (req, res) => {
    try {
      const { titulo, descricao, data_inicio, data_fim } = req.body;

      await db.query("CALL criar_campanha(?, ?, ?, ?)", [
        titulo,
        descricao,
        data_inicio,
        data_fim
      ]);

      res.json({ message: "Campanha criada com sucesso" });

    } catch (err) {
      res.status(500).json(err);
    }
  },

  atualizar: async (req, res) => {
    try {
      const id = req.params.id;
      const { titulo, descricao, data_inicio, data_fim } = req.body;

      await db.query("CALL atualizar_campanha(?, ?, ?, ?, ?)", [
        id,
        titulo,
        descricao,
        data_inicio,
        data_fim
      ]);

      res.json({ message: "Campanha atualizada" });

    } catch (err) {
      res.status(500).json(err);
    }
  },

  remover: async (req, res) => {
    try {
      const id = req.params.id;

      await db.query("CALL remover_campanha(?)", [id]);

      res.json({ message: "Campanha removida" });

    } catch (err) {
      res.status(500).json(err);
    }
  },

  listar: async (req, res) => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM campanhas ORDER BY data_inicio DESC"
      );
      res.json(rows);

    } catch (err) {
      res.status(500).json(err);
    }
  }
};
