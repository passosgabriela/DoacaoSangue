// services/userService.js
import { db } from "../config/db.js";

export const userService = {

  findById: async (id) => {
    const [rows] = await db.query(
      `SELECT 
        id,
        nome,
        email,
        idade,
        peso,
        condicoes_saude,
        tipo_sanguineo,
        senha
      FROM usuarios
      WHERE id = ?`,
      [id]
    );
    return rows[0];
  },

  findByEmail: async (email) => {
    const [rows] = await db.query(`SELECT * FROM usuarios WHERE email = ?`, [email]);
    return rows[0];
  },

  create: async (data) => {
    const { nome, email, senhaHash, idade, peso, condicoes_saude, tipo_sanguineo } = data;
    await db.query(
      `INSERT INTO usuarios
      (nome, email, senha, idade, peso, condicoes_saude, tipo_sanguineo)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nome, email, senhaHash, idade, peso, condicoes_saude, tipo_sanguineo]
    );
  }
};
