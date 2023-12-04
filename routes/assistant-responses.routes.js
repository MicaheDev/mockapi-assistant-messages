const express = require("express");
const router = express.Router();
const AssistantResponse = require("../models/assistantResponses.model");

// Endpoint para obtener todas las ventas
router.get("/", async (req, res) => {
  res.send("Hola");
});

router.get("/:room/:category", async (req, res) => {
  const { room, category } = req.params;
  try {
    const preguntas = await AssistantResponse.find({ room, category });
    res.json(preguntas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las preguntas." });
  }
});

router.get("/:room/search/:search", async (req, res) => {
  const { room, search } = req.params;
  try {
    // Obtén todas las preguntas para la sala específica
    const preguntas = await AssistantResponse.find({ room });

    // Filtra las preguntas que contienen el texto de búsqueda en el campo Q
    const preguntasFiltradas = preguntas.filter((pregunta) => {
      // Itera sobre las claves del objeto Q
      for (const key in pregunta.Q) {
        // Convierte el valor a cadena antes de usar includes
        const valorCadena = pregunta.Q[key].toString();
        if (valorCadena.includes(search)) {
          // Si encuentra una coincidencia, devuelve true para incluir la pregunta en los resultados
          return true;
        }
      }
      // Si no hay coincidencias, devuelve false para excluir la pregunta de los resultados
      return false;
    });

    res.json(preguntasFiltradas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las preguntas." });
  }
});

router.get("/:room", async (req, res) => {
  const { room } = req.params;
  try {
    const preguntas = await AssistantResponse.find({ room });
    res.json(preguntas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las preguntas." });
  }
});

router.post("/", async (req, res) => {
  const { room, Q, A, timestamp, category, userCreator } = req.body;

  try {
    const nuevaPregunta = new AssistantResponse({
      room,
      Q,
      A,
      timestamp,
      category,
      userCreator,
    });
    await nuevaPregunta.save();
    res.json({ message: "Pregunta creada exitosamente." });
  } catch (error) {
    res.status(500).json({ error: "Error al crear la pregunta." });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { Q, A, operation, timestamp, category, userCreator } = req.body;

  try {
    const pregunta = await AssistantResponse.findById(id);

    if (!pregunta) {
      return res.status(404).json({ error: "Pregunta no encontrada." });
    }

    // Actualizar el timestamp si está presente en el cuerpo de la solicitud
    if (timestamp) {
      pregunta.timestamp = timestamp;
    }

    if (category) {
      respuesta.category = category;
    }

    if (userCreator) {
      respuesta.userCreator = userCreator;
    }

    if (operation === "editQ") {
      // Editar Q
      pregunta.Q = Q;
    } else if (operation === "deleteQ") {
      // Eliminar Q
      const qIdToDelete = req.body.qIdToDelete;
      pregunta.Q = pregunta.Q.filter((q) => q.qId !== qIdToDelete);
    } else if (operation === "addQ") {
      // Añadir Q
      const newQ = req.body.newQ;
      pregunta.Q.push(newQ);
    }

    if (operation === "editA") {
      // Editar A
      pregunta.A = A;
    }

    await pregunta.save();
    res.json({ message: "Operaciones realizadas exitosamente." });
  } catch (error) {
    res.status(500).json({ error: "Error al realizar las operaciones." });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await AssistantResponse.findByIdAndDelete(id);

    if (result) {
      res.json({ message: "Pregunta eliminada exitosamente." });
    } else {
      res.status(404).json({ error: "Pregunta no encontrada." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la pregunta." });
  }
});

module.exports = router;
