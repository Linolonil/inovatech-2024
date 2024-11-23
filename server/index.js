import { WebSocketServer, WebSocket } from "ws";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Habilitando CORS para todas as origens
app.use(cors());

// Variável para armazenar os dados do sensor
let dadosSensor = null;

// Inicializa o servidor HTTP
const server = app.listen(PORT, () => {
  console.log(
    `[${new Date().toISOString()}] Servidor rodando na porta ${PORT}`
  );
});

// Configuração do WebSocket
const wss = new WebSocketServer({ server });

// Intervalo de ping para manter conexões ativas
const PING_INTERVAL = 30000; // 30 segundos

// Configuração de conexões WebSocket
wss.on("connection", (ws) => {
  console.log(`[${new Date().toISOString()}] Novo cliente conectado.`);

  // Envia mensagem de boas-vindas
  ws.send(
    JSON.stringify({
      message: "Server WebSocket conectado com sucesso!",
      timestamp: new Date().toISOString(),
    })
  );

  // Recebe mensagens
  ws.on("message", (message) => {
    try {
      const dadosRecebidos = JSON.parse(message);
      // Validação dos dados recebidos

      // Validação dos dados recebidos
      if (
        !dadosRecebidos ||
        typeof dadosRecebidos !== "object" ||
        Array.isArray(dadosRecebidos) ||
        typeof dadosRecebidos.ppm !== "number" // Verifica se ppm é um número
      ) {
        console.error("Dados inválidos recebidos:", dadosRecebidos);
        return;
      }

      console.log(
        `[${new Date().toISOString()}] Dados recebidos do ESP8266:`,
        dadosRecebidos
      );

      // Atualiza os dados do sensor
      dadosSensor = dadosRecebidos;

      // Validação dos dados recebidos
      if (!dadosRecebidos.ppm || typeof dadosRecebidos.ppm !== "number") {
        console.error("Dados inválidos recebidos:", dadosRecebidos);
        return;
      }

      // Envia os dados para todos os outros clientes conectados
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(dadosRecebidos));
        }
      });
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] Erro ao processar mensagem:`,
        error.message
      );
    }
  });

  // Gerenciamento de desconexões
  ws.on("close", () => {
    console.log(`[${new Date().toISOString()}] Cliente desconectado.`);
  });
});

// Envia pings para manter conexões ativas
setInterval(() => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.ping(); // Envia ping
    }
  });
}, PING_INTERVAL);

// Endpoint para obter os dados do sensor
app.get("/sensor", (req, res) => {
  if (dadosSensor) {
    res.json({
      status: "success",
      timestamp: new Date().toISOString(),
      dados: dadosSensor,
    });
  } else {
    res.status(404).json({
      status: "error",
      timestamp: new Date().toISOString(),
      message: "Nenhum dado do sensor disponível no momento.",
    });
  }
});

console.log(
  `[${new Date().toISOString()}] Servidor WebSocket inicializado e aguardando conexões...`
);
