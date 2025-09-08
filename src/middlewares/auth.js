const jwt = require("jsonwebtoken");

const getTokenFromHeader = (req) => {
  const h = req.headers?.authorization || req.headers?.Authorization;
  if (!h) return null;
  const parts = h.split(" ");
  return parts.length === 2 ? parts[1] : parts[0];
};

const verifyToken = (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);
    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "JWT_SECRET no configurado" });
    }

    const payload = jwt.verify(token, secret);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

const checkAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Acceso solo para administradores" });
  }
  next();
};

module.exports = { verifyToken, checkAdmin };
