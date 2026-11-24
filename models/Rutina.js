const mongoose = require("mongoose");

const ejercicioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del ejercicio es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
    },
    series: {
      type: Number,
      required: [true, "Las series son obligatorias"],
      min: [1, "Debe haber al menos 1 serie"],
      max: [10, "El máximo es 10 series"],
    },
    repeticiones: {
      type: Number,
      required: [true, "Las repeticiones son obligatorias"],
      min: [1, "Debe haber al menos 1 repetición"],
      max: [100, "El máximo es 100 repeticiones"],
    },
  },
  { timestamps: true }
);

const rutinaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre de la rutina es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
    },
    nivel: {
      type: String,
      trim: true,
      enum: {
        values: ["Principiante", "Intermedio", "Avanzado"],
        message: "El nivel debe ser Principiante, Intermedio o Avanzado",
      },
    },
    duracionMinutos: {
      type: Number,
      min: [5, "La duración mínima es 5 minutos"],
      max: [240, "La duración máxima es 240 minutos"],
    },
    entrenador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entrenador",
      required: [true, "El entrenador es obligatorio"],
    },
    ejercicios: [ejercicioSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rutina", rutinaSchema);