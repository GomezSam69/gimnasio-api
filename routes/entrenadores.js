const express = require("express");
const Entrenador = require("../models/Entrenador");
const Rutina = require("../models/Rutina");

const router = express.Router();

// Convierte errores de Mongoose en respuestas claras
function manejarError(error, res) {
  if (error.name === "ValidationError") {
    const mensajes = Object.values(error.errors).map((e) => e.message);
    return res.status(400).json({ errores: mensajes });
  }
  if (error.name === "CastError") {
    return res.status(400).json({ error: "El id no es válido" });
  }
  return res.status(500).json({ error: error.message });
}

// CREATE: crear un entrenador
router.post("/", async (req, res) => {
  try {
    const entrenador = await Entrenador.create(req.body);
    res.status(201).json(entrenador);
  } catch (error) {
    manejarError(error, res);
  }
});

// READ: listar todos los entrenadores
router.get("/", async (req, res) => {
  try {
    const entrenadores = await Entrenador.find();
    res.json(entrenadores);
  } catch (error) {
    manejarError(error, res);
  }
});

// READ: obtener un entrenador por id
router.get("/:id", async (req, res) => {
  try {
    const entrenador = await Entrenador.findById(req.params.id);
    if (!entrenador)
      return res.status(404).json({ error: "Entrenador no encontrado" });
    res.json(entrenador);
  } catch (error) {
    manejarError(error, res);
  }
});

// UPDATE: actualizar un entrenador
router.put("/:id", async (req, res) => {
  try {
    const entrenador = await Entrenador.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!entrenador)
      return res.status(404).json({ error: "Entrenador no encontrado" });
    res.json(entrenador);
  } catch (error) {
    manejarError(error, res);
  }
});

// DELETE: eliminar un entrenador (solo si no tiene rutinas)
router.delete("/:id", async (req, res) => {
  try {
    const tieneRutinas = await Rutina.exists({ entrenador: req.params.id });
    if (tieneRutinas) {
      return res
        .status(409)
        .json({ error: "No se puede eliminar: el entrenador tiene rutinas" });
    }
    const entrenador = await Entrenador.findByIdAndDelete(req.params.id);
    if (!entrenador)
      return res.status(404).json({ error: "Entrenador no encontrado" });
    res.json({ mensaje: "Entrenador eliminado" });
  } catch (error) {
    manejarError(error, res);
  }
});

module.exports = router;