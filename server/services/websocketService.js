import { WebSocketServer, WebSocket } from "ws";

const sensorConnections = new Map();  
const userConnections = new Map();    

export const initializeWebSocket = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log(`[${new Date().toISOString()}] Novo cliente conectado.`);

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message);
        const { type, sensorId, userId, deviceName, dados } = data;

        if (type === "sensor" && sensorId && deviceName && dados) {

          console.log(`Sensor ${sensorId} (${deviceName}) enviando dados:`, dados);

          sensorConnections.set(sensorId, ws);

          userConnections.forEach((userWs, userId) => {
            if (userWs.readyState === WebSocket.OPEN && userWs.userId && userWs.userId === userId) {
              userWs.send(JSON.stringify({
                type: "sensorData",
                sensorId,
                data: dados,
                deviceName,
              }));
            }
          });
        } else if (type === "usuario" && userId && sensorId) {
          console.log(`Usuário ${userId} solicitando dados do sensor ${sensorId}`);

          
          if (userConnections.has(userId)) {
            const oldUserWs = userConnections.get(userId);
            if (oldUserWs.readyState === WebSocket.OPEN) {
              console.log(`Fechando a conexão anterior do usuário ${userId}.`);
              oldUserWs.close();
            }
          }

          userConnections.set(userId, ws);
          ws.userId = userId;  

          if (!userConnections.has(userId)) {
            userConnections.set(userId, new Set());
          }
          const userSet = userConnections.get(userId);
          userSet.add(sensorId);

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

    ws.on("close", () => {
      console.log(`[${new Date().toISOString()}] Cliente desconectado.`);

      if (ws.userId) {
        userConnections.delete(ws.userId);
        console.log(`Usuário ${ws.userId} desconectado.`);
      }

      sensorConnections.forEach((sensorWs, sensorId) => {
        if (sensorWs === ws) {
          sensorConnections.delete(sensorId);
          console.log(`Sensor ${sensorId} desconectado.`);
        }
      });
    });

    ws.on("error", (error) => {
      console.error("Erro no WebSocket:", error.message);
    });
  });

  return wss;
};
