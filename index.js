const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require('body-parser');


const app = express();
const server = http.createServer(app);


const { connectToDatabase } = require("./config/db");

connectToDatabase();

const assistantResponses = require("./routes/assistant-responses.routes");

// Configuración y middlewares globales //
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());




app.use("/mock-api/assistant-responses", assistantResponses);

PORT = process.env.PORT;

server.listen(PORT, () => {
  console.info(`Servidor corriendo en http://localhost:${PORT || 8000}`);
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});
