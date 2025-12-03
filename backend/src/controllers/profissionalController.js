import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
      res.status(500).json({ error: err.message || err });
    }
  },

  listar: async (req, res) => {
    try {
      const lista = await profissionalService.findAll();
      res.json(lista);
    } catch (err) {
      res.status(500).json({ error: err.message || err });
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
      res.status(500).json({ error: err.message || err });
    }
  },

  remover: async (req, res) => {
    try {
      const id = req.params.id;
      await profissionalService.remover(id);
      res.json({ message: "Profissional removido" });
    } catch (err) {
      res.status(500).json({ error: err.message || err });
    }
  }
};
