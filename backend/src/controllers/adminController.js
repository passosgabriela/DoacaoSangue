import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";

export const adminController = {

  registrar: async (req, res) => {
    try {
      const { nome, email, senha } = req.body;

      // verifica se email já existe
      const [[existing]] = await db.query(
        "SELECT id FROM admins WHERE email = ?",
        [email]
      );
      if (existing)
        return res.status(400).json({ message: "Email já cadastrado" });

      const hash = await bcrypt.hash(senha, 10);

      await db.query("CALL criar_admin(?, ?, ?)", [
        nome,
        email,
        hash
      ]);

      res.json({ message: "Admin criado com sucesso" });

    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  login: async (req, res) => {
    try {
      const { email, senha } = req.body;

      const [[admin]] = await db.query(
        "SELECT * FROM admins WHERE email = ?",
        [email]
      );

      if (!admin)
        return res.status(404).json({ message: "Admin não encontrado" });

      const ok = await bcrypt.compare(senha, admin.senha);
      if (!ok)
        return res.status(401).json({ message: "Senha incorreta" });

      const token = jwt.sign(
        { id: admin.id, role: "adm" },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
      );

      delete admin.senha;
      res.json({ message: "Login realizado", token, admin });

    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  listar: async (req, res) => {
    try {
      const [rows] = await db.query("SELECT id, nome, email, data_criacao FROM admins");
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  atualizar: async (req, res) => {
    try {
      const id = req.params.id;
      const { nome, email } = req.body;

      await db.query("CALL atualizar_admin(?, ?, ?)", [
        id, nome, email
      ]);

      res.json({ message: "Admin atualizado" });

    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  remover: async (req, res) => {
    try {
      const id = req.params.id;

      await db.query("CALL remover_admin(?)", [id]);

      res.json({ message: "Admin removido" });

    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
};
