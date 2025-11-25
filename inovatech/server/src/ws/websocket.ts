import { WebSocket, WebSocketServer } from "ws";
import ComboModel from "../models/Combo";
import DeviceModel from "../models/Device";
import EventModel from "../models/Event";

type DeviceBuffer = Array<any>;
const deviceBuffers = new Map<string, DeviceBuffer>(); // runtime buffers if needed

export function initializeWebSocket(server: any) {
    const wss = new WebSocketServer({ server });

    // Map deviceId -> Set of parent WS connections (for broadcast)
    const parentsByDevice = new Map<string, Set<WebSocket>>();

    wss.on("connection", (ws: WebSocket) => {
        console.log("WS: new client connected");

        // Optional: authenticate parent clients here by token query param / header
        // e.g., ws?token=xxx&subscribe=CRIANCA-01

        ws.on("message", async (raw) => {
            let msg: any;
            try {
                msg = JSON.parse(raw.toString());
            } catch {
                console.log("WS: non-json received:", raw.toString());
                return;
            }

            // If parent asks to subscribe
            if (msg.type === "subscribe" && msg.deviceId) {
                const set = parentsByDevice.get(msg.deviceId) || new Set();
                set.add(ws);
                parentsByDevice.set(msg.deviceId, set);
                ws.send(JSON.stringify({ type: "subscribed", deviceId: msg.deviceId }));
                return;
            }

            // If parent unsubscribes
            if (msg.type === "unsubscribe" && msg.deviceId) {
                const set = parentsByDevice.get(msg.deviceId);
                set?.delete(ws);
                ws.send(JSON.stringify({ type: "unsubscribed", deviceId: msg.deviceId }));
                return;
            }

            // If device sent a buffer of items
            if (msg.event === "buffer" && Array.isArray(msg.items)) {
                for (const item of msg.items) {
                    await handleButtonPress(item, parentsByDevice);
                }
                return;
            }

            // Single events from device
            if (msg.event === "buttonPress") {
                await handleButtonPress(msg, parentsByDevice);
                return;
            }

            console.log("WS: unknown message", msg);
        });

        ws.on("close", () => {
            // remove from parentsByDevice sets
            for (const [deviceId, set] of parentsByDevice.entries()) {
                if (set.has(ws)) set.delete(ws);
            }
            console.log("WS: client disconnected");
        });

        ws.on("error", (err) => console.error("WS error", err));
    });

    return wss;
}

// core handler
async function handleButtonPress(msg: any, parentsByDevice: Map<string, Set<WebSocket>>) {
    const deviceId = msg.deviceId;
    const payload = {
        deviceId,
        type: "buttonPress",
        data: msg.data,
        timestamp: new Date(msg.timestamp || Date.now())
    };

    // 1) Save to DB
    try {
        await EventModel.create({
            deviceId,
            type: payload.type,
            data: payload.data,
            timestamp: payload.timestamp
        });
    } catch (err) {
        console.error("DB save error", err);
    }

    // 2) Detect combos (simple local detection using device config / combos)
    // Load device config and combos
    try {
        const device = await DeviceModel.findOne({ deviceId }).lean();
        const combos = await ComboModel.find({ deviceId }).lean();

        // append to runtime buffer for this device
        const buf = deviceBuffers.get(deviceId) || [];
        buf.push(payload.data.buttonId);
        // cap buffer
        if (buf.length > 20) buf.shift();
        deviceBuffers.set(deviceId, buf);

        // check combos
        for (const c of combos) {
            const seq = c.sequence;
            // simple suffix match
            if (seq.length <= buf.length) {
                const suffix = buf.slice(-seq.length);
                if (JSON.stringify(suffix) === JSON.stringify(seq)) {
                    // combo matched
                    const comboEvent = {
                        type: "comboEvent",
                        deviceId,
                        name: c.name,
                        message: c.message,
                        sequence: seq,
                        timestamp: new Date()
                    };
                    // notify parents
                    const set = parentsByDevice.get(deviceId);
                    set?.forEach(ws => {
                        if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(comboEvent));
                    });
                    // optionally save comboEvent to DB as Event with type "combo"
                    await EventModel.create({ deviceId, type: "combo", data: comboEvent, timestamp: new Date() });
                }
            }
        }
    } catch (err) {
        console.error("Combo/check error", err);
    }

    // 3) Broadcast simple buttonEvent to parents subscribed
    const packet = {
        type: "buttonEvent",
        deviceId,
        data: payload.data,
        timestamp: payload.timestamp
    };
    const set = parentsByDevice.get(deviceId);
    set?.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(packet));
    });
}
