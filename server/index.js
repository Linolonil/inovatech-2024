import { WebSocketServer } from 'ws';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Habilitando CORS para todas as origens
app.use(cors());

// Variável para armazenar os dados do sensor
let dadosSensor = null;

// Inicializa o servidor HTTP
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Configuração do WebSocket
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Novo cliente conectado!');

  // Envia mensagem de boas-vindas
  ws.send(JSON.stringify({ message: 'Server WebSocket conectado com sucesso, papai!' }));

  ws.on('message', (message) => {
    try {
      const dadosRecebidos = JSON.parse(message);
      console.log('Dados recebidos do ESP8266:', dadosRecebidos);

      // Atualiza os dados do sensor
      dadosSensor = dadosRecebidos;

      // Envia os dados para todos os outros clientes conectados
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === 1) { // Verifica se o cliente está conectado e pronto
          client.send(JSON.stringify(dadosRecebidos));
        }
      });

    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
    }
  });

  ws.on('close', () => {
    console.log('Cliente desconectado.');
  });
});

// Endpoint para obter os dados do sensor
app.get('/sensor', (req, res) => {
  if (dadosSensor) {
    res.json({
      status: 'success',
      dados: dadosSensor,
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: 'Nenhum dado do sensor disponível no momento.',
    });
  }
});

console.log('Servidor WebSocket inicializado e aguardando conexões...');
