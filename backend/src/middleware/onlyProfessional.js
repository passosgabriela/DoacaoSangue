export const onlyProfessional = (req, res, next) => {
  if (req.role !== "profissional") {
    return res.status(403).json({
      message: "Apenas profissionais podem acessar este recurso"
    });
  }
  next();
};
