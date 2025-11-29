// backend/src/controllers/userController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const userController = {
  register: async (req, res) => {
    try {
      const { nome, email, senha, idade, peso, condicoes_saude, tipo_sanguineo } = req.body;
      const userExists = await User.findByEmail(email);
      if (userExists) return res.status(400).json({ message: "Email já cadastrado" });

      const hash = bcrypt.hashSync(senha, 10);
      const insertId = await User.create([nome, email, hash, idade, peso, condicoes_saude, tipo_sanguineo]);
      return res.json({ message: "Usuário criado com sucesso", id: insertId });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  login: async (req, res) => {
    try {
      const { email, senha } = req.body;
      const user = await User.findByEmail(email);
      if (!user) return res.status(400).json({ message: "Usuário não encontrado" });

      const ok = bcrypt.compareSync(senha, user.senha);
      if (!ok) return res.status(400).json({ message: "Senha incorreta" });

      const token = jwt.sign({ id: user.id, role: "usuario" }, process.env.JWT_SECRET, { expiresIn: "8h" });
      delete user.senha;
      res.json({ message: "Login realizado com sucesso", token, usuario: user });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  me: async (req, res) => {
    try {
      const id = req.userId;
      if (!id) return res.status(401).json({ message: "Token válido, mas não é um usuário" });
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
      delete user.senha;
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  }
};
