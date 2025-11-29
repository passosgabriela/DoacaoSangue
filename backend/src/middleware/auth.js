// backend/src/middleware/auth.js
import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Token não enviado" });

  const parts = header.split(" ");
  if (parts.length !== 2) return res.status(401).json({ message: "Token inválido" });

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Suporta tokens com { id, role } para usuário ou { profissionalId, role } para profissional
    req.userId = decoded.id || null;
    req.profissionalId = decoded.profissionalId || null;
    req.role = decoded.role || null;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
};
