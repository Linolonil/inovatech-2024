import WebSocket from "ws";

const URL = "ws://localhost:3000"; // se usar ngrok troque para wss://xxxxx.ngrok-free.app
const deviceId = "CRIANCA-01";

const ws = new WebSocket(URL);

ws.on("open", () => {
    console.log("device-sim connected");

    // simulate buffer send when reconnecting
    const buffer = {
        deviceId,
        event: "buffer",
        items: [
            { deviceId, event: "buttonPress", data: { buttonId: 0, color: "BRANCO2" }, timestamp: new Date().toISOString() },
            { deviceId, event: "buttonPress", data: { buttonId: 13, color: "VERDE" }, timestamp: new Date().toISOString() }
        ]
    };

    ws.send(JSON.stringify(buffer));

    // send live events after buffer
    setTimeout(() => {
        const single = { deviceId, event: "buttonPress", data: { buttonId: 5, color: "PRETO" }, timestamp: new Date().toISOString() };
        ws.send(JSON.stringify(single));
        console.log("sent live event");
    }, 2000);
});

ws.on("message", (m) => console.log("from server:", m.toString()));
ws.on("error", console.error);
ws.on("close", () => console.log("closed"));
