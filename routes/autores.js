const express = require("express");
const Autor = require("../models/Autor");
const Libro = require("../models/Libro");

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

// CREATE: crear un autor
router.post("/", async (req, res) => {
  try {
    const autor = await Autor.create(req.body);
    res.status(201).json(autor);
  } catch (error) {
    manejarError(error, res);
  }
});

// READ: listar todos los autores
router.get("/", async (req, res) => {
  try {
    const autores = await Autor.find();
    res.json(autores);
  } catch (error) {
    manejarError(error, res);
  }
});

// READ: obtener un autor por id
router.get("/:id", async (req, res) => {
  try {
    const autor = await Autor.findById(req.params.id);
    if (!autor) return res.status(404).json({ error: "Autor no encontrado" });
    res.json(autor);
  } catch (error) {
    manejarError(error, res);
  }
});

// UPDATE: actualizar un autor
router.put("/:id", async (req, res) => {
  try {
    const autor = await Autor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!autor) return res.status(404).json({ error: "Autor no encontrado" });
    res.json(autor);
  } catch (error) {
    manejarError(error, res);
  }
});

// DELETE: eliminar un autor (solo si no tiene libros)
router.delete("/:id", async (req, res) => {
  try {
    const tieneLibros = await Libro.exists({ autor: req.params.id });
    if (tieneLibros) {
      return res
        .status(409)
        .json({ error: "No se puede eliminar: el autor tiene libros" });
    }
    const autor = await Autor.findByIdAndDelete(req.params.id);
    if (!autor) return res.status(404).json({ error: "Autor no encontrado" });
    res.json({ mensaje: "Autor eliminado" });
  } catch (error) {
    manejarError(error, res);
  }
});

module.exports = router;