// app.js
import dotenv from "dotenv";
import http from "http";
import apiRoutes from "./routes/apiRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import sensorRoutes from "./routes/sensorRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import validadeTokenUser from "./routes/validateToken.js";
import { initializeWebSocket } from "./services/websocketService.js";
import connectDB from './config/db.js';
import express from "express";
import cors from "cors";


const app = express();

dotenv.config();
connectDB(); 

app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Configuração de rotas
app.use("/api", apiRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/sensores", sensorRoutes);
app.use("/api/login", loginRoutes);
app.use('/api/v1/auth/validate-token', validadeTokenUser);


// Inicializa o WebSocket
initializeWebSocket(server);

// Inicia o servidor
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
