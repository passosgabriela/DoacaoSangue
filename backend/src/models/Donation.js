import { db } from "../config/db.js";

export const Donation = {
  create: async (data) => {
    const sql = `
      INSERT INTO doacoes 
      (usuario_id, data_doacao, volume_coletado, tipo_sanguineo)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, data);
    return result.insertId;
  },

  findByUser: async (userId) => {
    const [rows] = await db.query(
      "SELECT * FROM doacoes WHERE usuario_id = ?",
      [userId]
    );
    return rows;
  }
};
