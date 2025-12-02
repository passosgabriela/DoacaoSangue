import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { profissionalService } from "../services/profissionalService.js";

export const profissionalController = {

  cadastrar: async (req, res) => {
    try {
      const { nome, registro_profissional, contato, email, senha } = req.body;

      const existing = await profissionalService.findByEmail(email);
      if (existing) 
        return res.status(400).json({ message: "Email já cadastrado" });

      const senhaHash = await bcrypt.hash(senha, 10);

      await profissionalService.create({
        nome,
        registro_profissional,
        contato,
        email,
        senhaHash
      });

      res.json({ message: "Profissional cadastrado" });

    } catch (err) {
      res.status(500).json(err);
    }
  },

  login: async (req, res) => {
    try {
      const { email, senha } = req.body;

      const prof = await profissionalService.findByEmail(email);
      if (!prof)
        return res.status(404).json({ message: "Profissional não encontrado" });

      const ok = await bcrypt.compare(senha, prof.senha);
      if (!ok)
        return res.status(401).json({ message: "Senha inválida" });

      const token = jwt.sign(
        { profissionalId: prof.id, role: "profissional" },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
      );

      delete prof.senha;

      res.json({ token, profissional: prof });

    } catch (err) {
      res.status(500).json(err);
    }
  },

  me: async (req, res) => {
    try {
      const id = req.profissionalId;

      const prof = await profissionalService.findById(id);

      if (!prof)
        return res.status(404).json({ message: "Profissional não encontrado" });

      delete prof.senha;

      res.json(prof);

    } catch (err) {
      res.status(500).json(err);
    }
  }
};
