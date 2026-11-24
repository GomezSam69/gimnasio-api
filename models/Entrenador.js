const mongoose = require("mongoose");

const entrenadorSchema = new mongoose.Schema(
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
    especialidad: {
      type: String,
      trim: true,
    },
    aniosExperiencia: {
      type: Number,
      min: [0, "Los años de experiencia no pueden ser negativos"],
      max: [60, "Los años de experiencia no son válidos"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Entrenador", entrenadorSchema);