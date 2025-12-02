import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "../config/db.js";

export const adminController = {

  register: async (req, res) => {
    try {
      const { nome, email, senha } = req.body;

      const [exists] = await db.query(
        "SELECT id FROM admins WHERE email = ?",
        [email]
      );
      if (exists.length > 0)
        return res.status(400).json({ message: "Email já cadastrado" });

      const hash = await bcrypt.hash(senha, 10);

      await db.query(
        "CALL criar_admin(?, ?, ?)",
        [nome, email, hash]
      );

      res.json({ message: "Admin criado com sucesso" });

    } catch (err) {
      res.status(500).json(err);
    }
  },

  login: async (req, res) => {
    try {
      const { email, senha } = req.body;

      const [rows] = await db.query(
        "SELECT * FROM admins WHERE email = ?",
        [email]
      );

      if (rows.length === 0)
        return res.status(400).json({ message: "Admin não encontrado" });

      const admin = rows[0];
      const ok = await bcrypt.compare(senha, admin.senha);

      if (!ok)
        return res.status(400).json({ message: "Senha inválida" });

      const token = jwt.sign(
        { id: admin.id, role: "adm" },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
      );

      delete admin.senha;

      res.json({ token, admin });

    } catch (err) {
      res.status(500).json(err);
    }
  }
};
