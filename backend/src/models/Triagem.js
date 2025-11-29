import { db } from "../config/db.js";

export const Triagem = {
  create: async (data) => {
    const sql = `
      INSERT INTO triagens
      (agendamento_id, profissional_id, pressao, batimentos, temperatura, observacoes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, data);
    return result.insertId;
  },

  findByAppointment: async (agendamentoId) => {
    const [rows] = await db.query(
      "SELECT * FROM triagens WHERE agendamento_id = ?",
      [agendamentoId]
    );
    return rows[0];
  },

  listAll: async () => {
    const [rows] = await db.query("SELECT t.*, p.nome as profissional_nome FROM triagens t LEFT JOIN profissionais p ON t.profissional_id = p.id ORDER BY t.id DESC");
    return rows;
  }

};

