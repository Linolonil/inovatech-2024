import WebSocket from "ws";

const URL = "ws://localhost:3000";
const deviceId = "CRIANCA-01";

const ws = new WebSocket(URL);

ws.on("open", () => {
    console.log("dash connected");
    ws.send(JSON.stringify({ type: "subscribe", deviceId }));
});

ws.on("message", (m) => {
    console.log("Mensagem recebida do WS:", m.toString());
});

ws.on("error", console.error);
