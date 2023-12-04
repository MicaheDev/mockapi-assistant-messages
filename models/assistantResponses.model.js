const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  room: String,
  id: String,
  Q: {
    type: Map,
    of: String,
  },
  A: String,
  timestamp: {
    type: Number,
    required: true,  // Haciendo que el timestamp sea obligatorio
  },
  category: String,
  userCreator: {
    type: String,
    require: true
  }
});

// Configuración para excluir los campos __v y _id en las respuestas
responseSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

// Creación del modelo basado en el esquema
const AssistantResponse = mongoose.model("AssistantResponse", responseSchema);

module.exports = AssistantResponse;
