function checkAdmin(req, res, next) {
  if (!req.user?.role) {
    return res.status(401).json({ message: "Autenticación requerida" });
  }
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Acceso denegado. Solo administradores." });
  }
  return next();
}

module.exports = checkAdmin;
