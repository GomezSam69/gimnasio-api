const mongoose = require("mongoose");

const resenaSchema = new mongoose.Schema(
  {
    usuario: {
      type: String,
      required: [true, "El nombre del usuario es obligatorio"],
      trim: true,
    },
    comentario: {
      type: String,
      required: [true, "El comentario es obligatorio"],
      trim: true,
      minlength: [5, "El comentario debe tener al menos 5 caracteres"],
    },
    calificacion: {
      type: Number,
      required: [true, "La calificación es obligatoria"],
      min: [1, "La calificación mínima es 1"],
      max: [5, "La calificación máxima es 5"],
    },
  },
  { timestamps: true }
);

const libroSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
      minlength: [2, "El título debe tener al menos 2 caracteres"],
    },
    anioPublicacion: {
      type: Number,
      min: [1000, "El año de publicación no es válido"],
      max: [new Date().getFullYear(), "El año no puede ser futuro"],
    },
    genero: {
      type: String,
      trim: true,
    },
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Autor",
      required: [true, "El autor es obligatorio"],
    },
    resenas: [resenaSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Libro", libroSchema);