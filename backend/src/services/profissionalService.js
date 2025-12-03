import { db } from "../config/db.js";

export const profissionalService = {
  findAll: async () => {
    const [rows] = await db.query(
      "SELECT id, nome, registro_profissional, email, contato FROM profissionais"
    );
    return rows;
  },

  findByEmail: async (email) => {
    const [[row]] = await db.query(
      "SELECT * FROM profissionais WHERE email = ?",
      [email]
    );
    return row;
  },

  findById: async (id) => {
    const [[row]] = await db.query(
      "SELECT * FROM profissionais WHERE id = ?",
      [id]
    );
    return row;
  },

  create: async ({ nome, registro_profissional, contato, email, senhaHash }) => {
    await db.query(
      "INSERT INTO profissionais (nome, registro_profissional, contato, email, senha) VALUES (?, ?, ?, ?, ?)",
      [nome, registro_profissional, contato, email, senhaHash]
    );
  },

  remover: async (id) => {
    await db.query("DELETE FROM profissionais WHERE id = ?", [id]);
  }
};
