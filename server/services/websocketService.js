import { WebSocketServer, WebSocket } from "ws";
// gambiarra inicio
let dataSensor03 = {}; 

 function setDataSensor03(data) {
  dataSensor03 = data; 
}

export function getDataSensor03() {
  return dataSensor03; 
}

// gambiarra fim

const sensorConnections = new Map();  
const userConnections = new Map();  

export const initializeWebSocket = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log(`[${new Date().toISOString()}] Novo cliente conectado.`);

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message);
        const { type, sensorId, userId, deviceName, dados, status } = data;
        
        if(sensorId == "001"){
          setDataSensor03(data)
        }
        // Quando um sensor envia dados de status
        if (type === "sensorStatus" && sensorId && status !== undefined) {
          console.log(`Sensor ${sensorId} está ${status ? "ativo" : "inativo"}`);

          // Atualiza a conexão do sensor com seu status
          sensorConnections.set(sensorId, { ws, status });

          // Envia o status para todos os usuários conectados
          userConnections.forEach((userWs, userId) => {
            if (userWs.readyState === WebSocket.OPEN && userWs.userId === userId) {
              userWs.send(JSON.stringify({
                type: "sensorStatus",
                sensorId,
                status,
              }));
            }
          });

        // Quando um sensor envia dados
        } else if (type === "sensor" && sensorId && deviceName && dados) {
          console.log(`Sensor ${sensorId} (${deviceName}) enviando dados:`, dados);

          // Atualiza a conexão do sensor
          sensorConnections.set(sensorId, { ws, status });

          // Envia os dados do sensor para os usuários conectados
          userConnections.forEach((userWs, userId) => {
            if (userWs.readyState === WebSocket.OPEN && userWs.userId === userId) {
              userWs.send(JSON.stringify({
                type: "sensorData",
                sensorId,
                data: dados,
                deviceName,
              }));
            }
          });

        // Quando um usuário solicita dados de um sensor
        } else if (type === "usuario" && userId && sensorId) {
          console.log(`Usuário ${userId} solicitando dados do sensor ${sensorId}`);

          // Fechar a conexão anterior do usuário, se necessário
          if (userConnections.has(userId)) {
            const oldUserWs = userConnections.get(userId);
            if (oldUserWs.readyState === WebSocket.OPEN) {
              console.log(`Fechando a conexão anterior do usuário ${userId}.`);
              oldUserWs.close();
            }
          }

          // Armazena a nova conexão do usuário
          userConnections.set(userId, ws);
          ws.userId = userId;  

          // Garantir que o usuário tenha um conjunto de sensores
          if (!userConnections.has(userId)) {
            userConnections.set(userId, new Set());
          }
          const userSet = userConnections.get(userId);
          userSet.add(sensorId);

          // Verifica se o sensor está ativo antes de enviar dados
          if (sensorConnections.has(sensorId)) {
            const sensorWs = sensorConnections.get(sensorId);
            if (sensorWs && sensorWs.readyState === WebSocket.OPEN) {
              sensorWs.send(JSON.stringify({
                type: "requestSensorData",
                sensorId,
                userId,
              }));
            }
          } else {
            ws.send(JSON.stringify({
              status: "error",
              message: `Sensor ${sensorId} não está ativo ou não foi conectado.`,
            }));
          }

        } else {
          ws.send(JSON.stringify({
            status: "error",
            message: "Dados inválidos ou tipo de conexão errado.",
          }));
        }

      } catch (error) {
        console.error("Erro ao processar a mensagem:", error.message);
        ws.send(JSON.stringify({
          status: "error",
          message: "Sensor desligado ou erro ao processar a mensagem.",
        }));
      }
    });

    // Quando um cliente desconecta
    ws.on("close", () => {
      console.log(`[${new Date().toISOString()}] Cliente desconectado.`);

      // Remove a conexão do usuário, se presente
      if (ws.userId) {
        userConnections.delete(ws.userId);
        console.log(`Usuário ${ws.userId} desconectado.`);
      }

      // Remove o sensor da lista de conexões
      sensorConnections.forEach((sensorWs, sensorId) => {
        if (sensorWs === ws) {
          sensorConnections.delete(sensorId);
          console.log(`Sensor ${sensorId} desconectado.`);
        }
      });
    });

    // Tratamento de erro no WebSocket
    ws.on("error", (error) => {
      console.error("Erro no WebSocket:", error.message);
    });
  });

  return wss;
};
