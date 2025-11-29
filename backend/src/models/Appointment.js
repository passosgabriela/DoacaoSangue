import { db } from "../config/db.js";

export const Appointment = {
  create: async (data) => {
    const sql = `
      INSERT INTO agendamentos 
      (usuario_id, data_agendamento, horario, status)
      VALUES (?, ?, ?, 'PENDENTE')
    `;
    const [result] = await db.query(sql, data);
    return result.insertId;
  },

  findByUser: async (userId) => {
    const [rows] = await db.query(
      "SELECT * FROM agendamentos WHERE usuario_id = ?",
      [userId]
    );
    return rows;
  }
};
