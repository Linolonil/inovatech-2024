// app.js
import dotenv from "dotenv";
import http from "http";
import path from "path";

import apiRoutes from "./routes/apiRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import sensorRoutes from "./routes/sensorRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import validadeTokenUser from "./routes/validateToken.js";
import {
  getDataSensor03,
  initializeWebSocket,
} from "./services/websocketService.js";
import connectDB from "./config/db.js";
import express from "express";
import cors from "cors";

const app = express();

dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const publicPath = path.resolve("public");
app.use(express.static(publicPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.use("/api", apiRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/sensores", sensorRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/v1/auth/validate-token", validadeTokenUser);

//  gambiarra inicio
app.get("/api/sensor", async (req, res) => {
  try {
    if (true) {
      const responseData = {
        status: "success",
        sensorId: getDataSensor03().sensorId,
        data: getDataSensor03(),
        message: `Dados do sensor 003 enviados com sucesso.`,
      };
      return res.status(200).json(responseData);
    }
  } catch (error) {
    console.error("Erro ao obter dados do sensor 003:", error);
    res.status(500).json({
      status: "error",
      message: "Erro ao obter dados do sensor 003.",
      error: error.message, // Inclui uma mensagem de erro para depuração
    });
  }
});
//  gambiarra fim

// Inicializa o WebSocket
initializeWebSocket(server);

// Inicia o servidor
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
