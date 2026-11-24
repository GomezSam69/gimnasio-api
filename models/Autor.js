const mongoose = require("mongoose");

const autorSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      match: [
        /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ\s.'-]+$/,
        "El nombre solo puede tener letras, tildes y ñ",
      ],
    },
    nacionalidad: {
      type: String,
      trim: true,
    },
    anioNacimiento: {
      type: Number,
      min: [1000, "El año de nacimiento no es válido"],
      max: [new Date().getFullYear(), "El año de nacimiento no puede ser futuro"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Autor", autorSchema);