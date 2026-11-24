const express = require("express");
const Rutina = require("../models/Rutina");
const Entrenador = require("../models/Entrenador");

const router = express.Router();

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

// CREATE: crear una rutina (el entrenador debe existir)
router.post("/", async (req, res) => {
  try {
    if (req.body.entrenador) {
      const entrenador = await Entrenador.findById(req.body.entrenador);
      if (!entrenador)
        return res.status(404).json({ error: "El entrenador no existe" });
    }
    const rutina = await Rutina.create(req.body);
    res.status(201).json(rutina);
  } catch (error) {
    manejarError(error, res);
  }
});

// READ: listar todas las rutinas (con los datos del entrenador)
router.get("/", async (req, res) => {
  try {
    const rutinas = await Rutina.find().populate(
      "entrenador",
      "nombre especialidad"
    );
    res.json(rutinas);
  } catch (error) {
    manejarError(error, res);
  }
});

// READ: obtener una rutina por id
router.get("/:id", async (req, res) => {
  try {
    const rutina = await Rutina.findById(req.params.id).populate(
      "entrenador",
      "nombre especialidad"
    );
    if (!rutina) return res.status(404).json({ error: "Rutina no encontrada" });
    res.json(rutina);
  } catch (error) {
    manejarError(error, res);
  }
});

// UPDATE: actualizar una rutina
router.put("/:id", async (req, res) => {
  try {
    const rutina = await Rutina.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!rutina) return res.status(404).json({ error: "Rutina no encontrada" });
    res.json(rutina);
  } catch (error) {
    manejarError(error, res);
  }
});

// DELETE: eliminar una rutina
router.delete("/:id", async (req, res) => {
  try {
    const rutina = await Rutina.findByIdAndDelete(req.params.id);
    if (!rutina) return res.status(404).json({ error: "Rutina no encontrada" });
    res.json({ mensaje: "Rutina eliminada" });
  } catch (error) {
    manejarError(error, res);
  }
});

// Endpoint del registro embebido: agregar un ejercicio a una rutina
router.post("/:id/ejercicios", async (req, res) => {
  try {
    const rutina = await Rutina.findById(req.params.id);
    if (!rutina) return res.status(404).json({ error: "Rutina no encontrada" });
    rutina.ejercicios.push(req.body);
    await rutina.save();
    res.status(201).json(rutina);
  } catch (error) {
    manejarError(error, res);
  }
});

module.exports = router;