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

      // 1 — Verifica se o agendamento existe
      const [[agendamento]] = await db.query(
        "SELECT status FROM agendamentos WHERE id = ?",
        [agendamento_id]
      );

      if (!agendamento)
        return res.status(404).json({ message: "Agendamento não encontrado" });

      // 2 — Bloqueia triagem em agendamento cancelado
      if (agendamento.status === "CANCELADO")
        return res.status(400).json({
          message: "Não é possível registrar triagem em um agendamento cancelado"
        });

      // 3 — Bloqueia triagem duplicada
      const [[triagemExistente]] = await db.query(
        "SELECT id FROM triagens WHERE agendamento_id = ?",
        [agendamento_id]
      );

      if (triagemExistente)
        return res.status(400).json({
          message: "Triagem já foi registrada para este agendamento"
        });

      // 4 — Chama a procedure que grava a triagem
      await db.query("CALL registrar_triagem(?, ?, ?, ?, ?, ?, ?)", [
        agendamento_id,
        profissionalId,
        pressao,
        batimentos,
        temperatura,
        observacoes,
        status
      ]);

      // Trigger trg_criar_doacao cuida da criação automática da doação

      res.json({ message: "Triagem registrada com sucesso" });

    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: err.sqlMessage || err.message || err
      });
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
