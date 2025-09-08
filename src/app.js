const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const fieldRoutes = require("./routes/field.routes");
const reservationRoutes = require("./routes/reservation.routes");
const adRoutes = require("./routes/ad.routes");

const app = express();

const allowed = process.env.ALLOWED_ORIGIN || "*";
console.log("🛡️  CORS allow origin:", allowed);

app.use(
  cors({
    origin: allowed,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.options("*", cors());

app.use(express.json());

//app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
//app.use("/api/fields", fieldRoutes);
//app.use("/api/reservations", reservationRoutes);
//app.use("/api/ads", adRoutes);
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || "*" }));

app.use((req, res) => {
  res.status(404).json({ message: "❌ Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Error interno del servidor",
  });
});

module.exports = app;
