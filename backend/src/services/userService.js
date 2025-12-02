import { db } from "../config/db.js";

export const userService = {
  
  create: async ({ nome, email, senhaHash, idade, peso, condicoes_saude, tipo_sanguineo }) => {
    const [result] = await db.query(
      "CALL criar_usuario(?, ?, ?, ?, ?, ?, ?)",
      [nome, email, senhaHash, idade, peso, condicoes_saude, tipo_sanguineo]
    );
    return result;
  },

  findByEmail: async (email) => {
    const [rows] = await db.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );
    return rows[0];
  },

  findById: async (id) => {
    const [rows] = await db.query(
      "SELECT * FROM usuarios WHERE id = ?",
      [id]
    );
    return rows[0];
  }
};
