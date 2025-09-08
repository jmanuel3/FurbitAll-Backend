const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller");
const verifyToken = require("../middlewares/auth.middleware");

router.post("/register", register);
router.post("/login", login);

router.get("/me", verifyToken, (req, res) => {
  res.json({
    message: "Ruta protegida accedida con éxito",
    user: req.user,
  });
});

module.exports = router;
