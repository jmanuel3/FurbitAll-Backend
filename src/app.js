// src/app.js (DIAGNÓSTICO)
const express = require("express");
const cors = require("cors");
const app = express();

// --- CORS PRIMERO ---
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("*", cors());

// Body parser
app.use(express.json());

// --- DEBUG: quién soy y health ---
app.get("/__whoami", (req, res) => {
  res.json({
    file: __filename,
    cwd: process.cwd(),
    node: process.version,
    env: process.env.NODE_ENV || "development",
    allowed_origin: process.env.ALLOWED_ORIGIN || "*",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || "development" });
});

// --- CARGA DE RUTAS con try/catch para aislar fallos ---
let authRoutes, productRoutes, fieldRoutes, reservationRoutes, adRoutes;
try {
  authRoutes = require("./routes/auth.routes");
  console.log("✅ Cargó auth.routes");
} catch (e) {
  console.error("❌ Falla en auth.routes.js:", e && e.stack ? e.stack : e);
}
try {
  productRoutes = require("./routes/product.routes");
  console.log("✅ Cargó product.routes");
} catch (e) {
  console.error("❌ Falla en product.routes.js:", e && e.stack ? e.stack : e);
}
try {
  fieldRoutes = require("./routes/field.routes");
  console.log("✅ Cargó field.routes");
} catch (e) {
  console.error("❌ Falla en field.routes.js:", e && e.stack ? e.stack : e);
}
try {
  reservationRoutes = require("./routes/reservation.routes");
  console.log("✅ Cargó reservation.routes");
} catch (e) {
  console.error(
    "❌ Falla en reservation.routes.js:",
    e && e.stack ? e.stack : e
  );
}
try {
  adRoutes = require("./routes/ad.routes");
  console.log("✅ Cargó ad.routes");
} catch (e) {
  console.error("❌ Falla en ad.routes.js:", e && e.stack ? e.stack : e);
}

// --- MONTA SÓLO LO QUE CARGÓ ---
if (authRoutes) app.use("/api/auth", authRoutes);
if (productRoutes) app.use("/api/products", productRoutes);
if (fieldRoutes) app.use("/api/fields", fieldRoutes);
if (reservationRoutes) app.use("/api/reservations", reservationRoutes);
if (adRoutes) app.use("/api/ads", adRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "❌ Ruta no encontrada" });
});

// Errores
app.use((err, _req, res, _next) => {
  console.error("🔥 Error global:", err);
  res.status(err.status || 500).json({
    message: err.message || "Error interno del servidor",
  });
});

module.exports = app;
