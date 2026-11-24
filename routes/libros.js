const express = require("express");
const Libro = require("../models/Libro");
const Autor = require("../models/Autor");

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


router.post("/", async (req, res) => {
  try {
    if (req.body.autor) {
      const autor = await Autor.findById(req.body.autor);
      if (!autor) return res.status(404).json({ error: "El autor no existe" });
    }
    const libro = await Libro.create(req.body);
    res.status(201).json(libro);
  } catch (error) {
    manejarError(error, res);
  }
});


router.get("/", async (req, res) => {
  try {
    const libros = await Libro.find().populate("autor", "nombre nacionalidad");
    res.json(libros);
  } catch (error) {
    manejarError(error, res);
  }
});


router.get("/:id", async (req, res) => {
  try {
    const libro = await Libro.findById(req.params.id).populate(
      "autor",
      "nombre nacionalidad"
    );
    if (!libro) return res.status(404).json({ error: "Libro no encontrado" });
    res.json(libro);
  } catch (error) {
    manejarError(error, res);
  }
});


router.put("/:id", async (req, res) => {
  try {
    const libro = await Libro.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!libro) return res.status(404).json({ error: "Libro no encontrado" });
    res.json(libro);
  } catch (error) {
    manejarError(error, res);
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const libro = await Libro.findByIdAndDelete(req.params.id);
    if (!libro) return res.status(404).json({ error: "Libro no encontrado" });
    res.json({ mensaje: "Libro eliminado" });
  } catch (error) {
    manejarError(error, res);
  }
});


router.post("/:id/resenas", async (req, res) => {
  try {
    const libro = await Libro.findById(req.params.id);
    if (!libro) return res.status(404).json({ error: "Libro no encontrado" });
    libro.resenas.push(req.body);
    await libro.save();
    res.status(201).json(libro);
  } catch (error) {
    manejarError(error, res);
  }
});

module.exports = router;