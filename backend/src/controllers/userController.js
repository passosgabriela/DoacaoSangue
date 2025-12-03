import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userService } from "../services/userService.js";
import { db } from "../config/db.js";

export const userController = {
  register: async (req, res) => {
    try {
      const { nome, email, senha, idade, peso, condicoes_saude, tipo_sanguineo } = req.body;

      const userExists = await userService.findByEmail(email);
      if (userExists) 
        return res.status(400).json({ message: "Email já cadastrado" });

      const hash = bcrypt.hashSync(senha, 10);

      await userService.create({
        nome,
        email,
        senhaHash: hash,
        idade,
        peso,
        condicoes_saude,
        tipo_sanguineo
      });

      res.json({ message: "Usuário criado com sucesso" });

    } catch (err) {
      res.status(500).json(err);
    }
  },

  login: async (req, res) => {
    try {
      const { email, senha } = req.body;

      const user = await userService.findByEmail(email);
      if (!user)
        return res.status(400).json({ message: "Usuário não encontrado" });

      const ok = bcrypt.compareSync(senha, user.senha);
      if (!ok)
        return res.status(400).json({ message: "Senha incorreta" });

      const token = jwt.sign(
        { id: user.id, role: "usuario" },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
      );

      delete user.senha;

      res.json({ token, usuario: user });

    } catch (err) {
      res.status(500).json(err);
    }
  },

  me: async (req, res) => {
  try {
    const id = req.userId;

    const user = await userService.findById(id);

    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado" });

    delete user.senha;
    res.json(user);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao carregar perfil", detail: err });
  }
},

  atualizarPerfil: async (req, res) => {
    try {
      const id = req.userId;

      const {
        nome,
        email,
        senha,
        idade,
        peso,
        condicoes_saude,
        tipo_sanguineo
      } = req.body;

      const [rows] = await db.query("SELECT * FROM usuarios WHERE id = ?", [id]);
      if (!rows.length)
        return res.status(404).json({ message: "Usuário não encontrado" });

      const atual = rows[0];

      let novaSenha = atual.senha;
      if (senha) {
        novaSenha = await bcrypt.hash(senha, 10);
      }

      await db.query(
        "CALL atualizar_usuario(?, ?, ?, ?, ?, ?, ?, ?)",
        [
          id,
          nome || atual.nome,
          email || atual.email,
          novaSenha,
          idade ?? atual.idade,
          peso ?? atual.peso,
          condicoes_saude ?? atual.condicoes_saude,
          tipo_sanguineo ?? atual.tipo_sanguineo
        ]
      );

      res.json({ message: "Perfil atualizado com sucesso!" });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao atualizar perfil", detail: err });
    }
  }
};
