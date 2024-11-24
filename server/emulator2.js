import { WebSocket } from "ws";
import dotenv from "dotenv";


dotenv.config();

const serverUrl = process.env.SERVER_WEBSOCKET_URL;
const LIMITE_GAS = 100;
const INTERVALO = 1500;
const DURACAO_CICLO = 5000;

const sensores = [
  { id: "003", offset: 500 }, 
];

function gerarDadosSensor(tempo, offset) {
  const proporcao = (tempo + offset) / DURACAO_CICLO;
  const ppm =
    proporcao <= 0.5
      ? LIMITE_GAS * (proporcao * 2) 
      : LIMITE_GAS * (1 - (proporcao - 0.5) * 2); 

  return {
    ppm: Math.max(0, Math.round(ppm)), 
    timestamp: new Date().toISOString(), 
  };
}

function conectarWebSocket(sensor) {
  const { id: sensorId, offset } = sensor;
  const socket = new WebSocket(serverUrl);
  let tempoAtual = 0; 

  socket.on("open", () => {
    console.log(`[${sensorId}] Conectado ao servidor WebSocket`);

    const intervaloEnvio = setInterval(() => {
      tempoAtual = (tempoAtual + 300) % DURACAO_CICLO;

      const dados = gerarDadosSensor(tempoAtual, offset);

      const dadosComplete = {
        dados,
        type: "sensor",
        deviceName: "ESP8266",
        sensorId,
      };

      console.log(`[${sensorId}] Enviando dados:`, dados);

      socket.send(JSON.stringify(dadosComplete));
    }, INTERVALO);

    socket.on("message", (data) => {
      console.log(`[${sensorId}] Mensagem do servidor:`, data.toString());
    });

    socket.on("close", () => {
      clearInterval(intervaloEnvio);
      console.log(`[${sensorId}] Conexão fechada. Tentando reconectar...`);
      setTimeout(() => conectarWebSocket(sensor), 4000); // Reconnect após 4 segundos
    });
  });

  socket.on("error", (error) => {
    console.error(`[${sensorId}] Erro na conexão WebSocket:`, error);
  });
}

sensores.forEach((sensor) => conectarWebSocket(sensor));
