// src/app.js
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const fieldRoutes = require("./routes/field.routes");
const reservationRoutes = require("./routes/reservation.routes");
const adRoutes = require("./routes/ad.routes");

const app = express();

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || "development" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/fields", fieldRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/ads", adRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "❌ Ruta no encontrada" });
});

app.use((err, _req, res, _next) => {
  console.error("🔥 Error global:", err);
  res.status(err.status || 500).json({
    message: err.message || "Error interno del servidor",
  });
});

module.exports = app;
