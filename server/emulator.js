import { WebSocket } from "ws";
import dotenv from "dotenv";


dotenv.config();

const serverUrl = process.env.SERVER_WEBSOCKET_URL;
const LIMITE_GAS = 100;
const INTERVALO = 1500;
const DURACAO_CICLO = 5000;

// Lista de sensores a serem emulados com offsets
const sensores = [
  { id: "002", offset: 1 }, 
];

// Função para gerar dados de sensor com offset
function gerarDadosSensor(tempo, offset) {
  const proporcao = (tempo + offset) / DURACAO_CICLO; // Adiciona o offset ao tempo 
  const ppm =
    proporcao <= 0.5
      ? LIMITE_GAS * (proporcao * 2) // Aumenta gradualmente na primeira metade do ciclo
      : LIMITE_GAS * (1 - (proporcao - 0.5) * 2); // Diminui gradualmente na segunda metade

  return {
    ppm: Math.max(0, Math.round(ppm)), // Gás em ppm (arredondado e >= 0)
    timestamp: new Date().toISOString(), // Adicionando timestamp ao dado
  };
}

// Função para conectar e emular um sensor
function conectarWebSocket(sensor) {
  const { id: sensorId, offset } = sensor;
  const socket = new WebSocket(serverUrl);
  let tempoAtual = 0; // Controla o tempo dentro do ciclo

  // Quando a conexão é aberta
  socket.on("open", () => {
    console.log(`[${sensorId}] Conectado ao servidor WebSocket`);

    // Enviar dados do sensor em intervalos definidos
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

      // Enviar dados ao servidor
      socket.send(JSON.stringify(dadosComplete));
    }, INTERVALO);

    // Captura mensagens do servidor
    socket.on("message", (data) => {
      console.log(`[${sensorId}] Mensagem do servidor:`, data.toString());
    });

    // Quando a conexão é fechada
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

// Inicia a emulação para todos os sensores na lista
sensores.forEach((sensor) => conectarWebSocket(sensor));
