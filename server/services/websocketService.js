import { WebSocketServer } from "ws";

export const initializeWebSocket = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log(`[${new Date().toISOString()}] Cliente conectado.`);

    ws.on("message", (message) => {
      try {
        // tenta transformar em JSON bonitinho
        let parsed;
        try {
          parsed = JSON.stringify(JSON.parse(message), null, 2);
        } catch {
          // se não for JSON, vira string normal
          parsed = String(message);
        }

        console.log("Mensagem recebida:", parsed);

        // envia para TODOS os clientes conectados
        wss.clients.forEach((client) => {
          if (client.readyState === ws.OPEN) {
            client.send(parsed);
          }
        });
      } catch (error) {
        console.error("Erro:", error.message);

        ws.send(
          JSON.stringify({
            status: "error",
            message: "Erro ao processar a mensagem.",
          })
        );
      }
    });

    ws.on("close", () => {
      console.log(`[${new Date().toISOString()}] Cliente desconectado.`);
    });

    ws.on("error", (error) => {
      console.error("Erro no WebSocket:", error.message);
    });
  });

  return wss;
};
