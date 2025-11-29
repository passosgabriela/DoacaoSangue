// backend/src/models/User.js (adicione findById)
import { db } from "../config/db.js";

export const User = {
  findByEmail: async (email) => {
    const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    return rows[0];
  },
  findById: async (id) => {
    const [rows] = await db.query("SELECT * FROM usuarios WHERE id = ?", [id]);
    return rows[0];
  },
  create: async (data) => {
    const sql = `
      INSERT INTO usuarios 
      (nome, email, senha, idade, peso, condicoes_saude, tipo_sanguineo)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, data);
    return result.insertId;
  }
};
