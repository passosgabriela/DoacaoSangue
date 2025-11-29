// backend/src/models/Profissional.js
import { db } from "../config/db.js";

export const Profissional = {
  findByEmail: async (email) => {
    const [rows] = await db.query("SELECT * FROM profissionais WHERE email = ?", [email]);
    return rows[0];
  },

  findById: async (id) => {
    const [rows] = await db.query("SELECT * FROM profissionais WHERE id = ?", [id]);
    return rows[0];
  },

  create: async ({ nome, registro_profissional, contato, email, senha }) => {
    const sql = `INSERT INTO profissionais (nome, registro_profissional, contato, email, senha) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await db.query(sql, [nome, registro_profissional, contato, email, senha]);
    return result.insertId;
  },

  listAll: async () => {
    const [rows] = await db.query("SELECT * FROM profissionais");
    return rows;
  }
};
