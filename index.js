require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {});
  })
  .catch((err) => {
    console.error("❌ Error al conectar con la base de datos:", err);
    process.exit(1);
  });

// app.use("/api", (req, res, next) => {
//   return res.status(404).json({ message: "Ruta de API no encontrada" });
// });

app.use((err, req, res, next) => {
  if (err.name === "CastError") {
    return res.status(400).json({ message: "ID inválido" });
  }
  const status = err.status || 500;
  const message = err.message || "Error del servidor";
  return res.status(status).json({ message });
});
