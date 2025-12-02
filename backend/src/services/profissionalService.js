import { db } from "../config/db.js";

export const profissionalService = {

  create: async ({ nome, registro_profissional, contato, email, senhaHash }) => {
    const [result] = await db.query(
      "CALL criar_profissional(?, ?, ?, ?, ?)",
      [nome, registro_profissional, contato, email, senhaHash]
    );
    return result;
  },

  findByEmail: async (email) => {
    const [rows] = await db.query(
      "SELECT * FROM profissionais WHERE email = ?",
      [email]
    );
    return rows[0];
  },

  findById: async (id) => {
    const [rows] = await db.query(
      "SELECT * FROM profissionais WHERE id = ?",
      [id]
    );
    return rows[0];
  }
};
