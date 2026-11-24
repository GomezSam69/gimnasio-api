process.loadEnvFile();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensaje: "API de biblioteca funcionando" });
});

const PORT = 3000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Conectado a MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`Servidor en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar:", error.message);
  });