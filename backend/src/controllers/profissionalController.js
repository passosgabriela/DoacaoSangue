// backend/src/controllers/profissionalController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Profissional } from "../models/Profissional.js";

export const profissionalController = {
  cadastrar: async (req, res) => {
    try {
      const { nome, registro_profissional, contato, email, senha } = req.body;
      const existing = await Profissional.findByEmail(email);
      if (existing) return res.status(400).json({ message: "Email já cadastrado" });

      const senhaHash = await bcrypt.hash(senha, 10);
      const id = await Profissional.create({ nome, registro_profissional, contato, email, senha: senhaHash });
      res.json({ message: "Profissional cadastrado", id });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  login: async (req, res) => {
    try {
      const { email, senha } = req.body;
      const prof = await Profissional.findByEmail(email);
      if (!prof) return res.status(404).json({ message: "Profissional não encontrado" });

      const ok = await bcrypt.compare(senha, prof.senha);
      if (!ok) return res.status(401).json({ message: "Senha inválida" });

      const token = jwt.sign({ profissionalId: prof.id, role: "profissional" }, process.env.JWT_SECRET, { expiresIn: "8h" });
      delete prof.senha;
      res.json({ message: "Login de profissional realizado", token, profissional: prof });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  me: async (req, res) => {
    try {
      const id = req.profissionalId;
      if (!id) return res.status(401).json({ message: "Token válido, mas não é um profissional" });
      const prof = await Profissional.findById(id);
      if (!prof) return res.status(404).json({ message: "Profissional não encontrado" });
      delete prof.senha;
      res.json(prof);
    } catch (err) {
      res.status(500).json(err);
    }
  }
};
