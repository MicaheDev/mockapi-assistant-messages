const express = require("express");
const router = express.Router();
const AssistantResponse = require("../models/assistantResponses.model")

// Endpoint para obtener todas las ventas
router.get("/", async (req, res) => {
    res.send("Hola")
});

router.get('/:room', async (req, res) => {
    const { room } = req.params;
    try {
      const preguntas = await AssistantResponse.find({ room });
      res.json(preguntas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las preguntas.' });
    }
  });
  
  router.post('/', async (req, res) => {
    const { room, Q, A, timestamp  } = req.body;
  
    try {
      const nuevaPregunta = new AssistantResponse({ room, Q, A, timestamp  });
      await nuevaPregunta.save();
      res.json({ message: 'Pregunta creada exitosamente.' });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la pregunta.' });
    }
  });
  
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { room, Q, A, operation, timestamp } = req.body;
  
    try {
      const pregunta = await AssistantResponse.findById(id);
  
      if (!pregunta) {
        return res.status(404).json({ error: 'Pregunta no encontrada.' });
      }
  
      // Actualizar el timestamp si está presente en el cuerpo de la solicitud
      if (timestamp) {
        pregunta.timestamp = timestamp;
      }
  
      if (operation === 'editQ') {
        // Editar Q
        pregunta.Q = Q;
      } else if (operation === 'deleteQ') {
        // Eliminar Q
        const qIdToDelete = req.body.qIdToDelete;
        pregunta.Q = pregunta.Q.filter((q) => q.qId !== qIdToDelete);
      } else if (operation === 'addQ') {
        // Añadir Q
        const newQ = req.body.newQ;
        pregunta.Q.push(newQ);
      }
  
      if (operation === 'editA') {
        // Editar A
        pregunta.A = A;
      }
  
      await pregunta.save();
      res.json({ message: 'Operaciones realizadas exitosamente.' });
    } catch (error) {
      res.status(500).json({ error: 'Error al realizar las operaciones.' });
    }
  });

  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await AssistantResponse.findByIdAndDelete(id);
  
      if (result) {
        res.json({ message: 'Pregunta eliminada exitosamente.' });
      } else {
        res.status(404).json({ error: 'Pregunta no encontrada.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la pregunta.' });
    }
  });
  

module.exports = router;
