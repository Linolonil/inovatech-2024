import express from 'express'; 
import WebSocket from 'ws'; 

const app = express();
const PORT = 3000;
const server = app.listen(PORT, () => {
  console.log(`Servidor HTTP rodando na porta ${PORT}`);
});

// Servidor WebSocket
const wss = new WebSocket.Server({ server });

// Quando um dispositivo conecta, envia uma mensagem de boas vindas
wss.on('connection', (ws) => {
  console.log('Novo dispositivo conectado!');
   
  ws.on('message', (message) => {
    console.log(`Dado recebido: ${message}`);
    // Repassa os dados para todos os clientes conectados
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Dispositivo desconectado!');
  });
});
