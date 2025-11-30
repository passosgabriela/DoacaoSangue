// backend/src/middleware/auth.js
import jwt from "jsonwebtoken";

// Middleware principal de autenticação
export const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Token não enviado" });

  const parts = header.split(" ");
  if (parts.length !== 2) return res.status(401).json({ message: "Token inválido" });

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Suporta:
    // Usuário:         { id, role: "usuario" }
    // Profissional:    { profissionalId, role: "profissional" }
    // Admin:           { id, role: "adm" }

    req.userId = decoded.id || null;
    req.profissionalId = decoded.profissionalId || null;
    req.role = decoded.role || null;

    next();

  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

// ======== RESTRIÇÕES DE ACESSO (Role-based Access) ========

// Somente USUÁRIO comum
export const onlyUser = (req, res, next) => {
  if (req.role !== "usuario") {
    return res.status(403).json({
      message: "Apenas usuários podem acessar este recurso"
    });
  }
  next();
};

// Somente PROFISSIONAL
export const onlyProfessional = (req, res, next) => {
  if (req.role !== "profissional") {
    return res.status(403).json({
      message: "Apenas profissionais podem acessar este recurso"
    });
  }
  next();
};

// Somente ADMIN
export const onlyAdmin = (req, res, next) => {
  if (req.role !== "adm") {
    return res.status(403).json({
      message: "Apenas administradores podem acessar este recurso"
    });
  }
  next();
};
