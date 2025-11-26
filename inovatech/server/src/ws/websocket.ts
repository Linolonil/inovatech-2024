import { Server } from "http";
import jwt from "jsonwebtoken";
import { WebSocket, WebSocketServer } from "ws";
import { DEFAULT_COMBOS } from "../config/defaultCombos";
import Device, { ICombo } from "../models/Device";
import Event from "../models/Event";
import { ComboDetector } from "../services/combo.service";

interface WebSocketClient extends WebSocket {
    userId?: string;
    deviceId?: string;
    isDevice?: boolean;
}

export function setupWebSocket(server: Server) {
    const wss = new WebSocketServer({ server, path: "/ws" });

    wss.on("connection", async (ws: WebSocketClient, req) => {
        console.log("Nova conexão WebSocket");

        const url = new URL(req.url!, `http://${req.headers.host}`);
        const token = url.searchParams.get("token");
        const deviceId = url.searchParams.get("deviceId");

        // ESP8266 conectando
        if (deviceId) {
            ws.isDevice = true;
            ws.deviceId = deviceId;

            const device = await Device.findOne({ deviceId });
            if (!device) {
                ws.send(JSON.stringify({ error: "Device not found" }));
                ws.close();
                return;
            }

            ws.userId = device.owner.toString();
            console.log(`[${new Date().toISOString()}] ESP8266 conectado: ${deviceId}`);

            ws.send(JSON.stringify({
                event: "connected",
                deviceId,
                message: "Conectado ao servidor",
                timestamp: new Date().toISOString()
            }));

            // Registrar conexão
            await Event.create({
                deviceId,
                userId: device.owner,
                event: "deviceConnected",
                data: {},
                timestamp: new Date()
            });
        }
        // Frontend conectando
        else if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
                ws.userId = decoded.id;
                ws.isDevice = false;
                console.log(`[${new Date().toISOString()}] Cliente frontend conectado: ${decoded.id}`);
            } catch (error) {
                ws.send(JSON.stringify({ error: "Invalid token" }));
                ws.close();
                return;
            }
        }
        else {
            ws.send(JSON.stringify({ error: "Authentication required" }));
            ws.close();
            return;
        }

        // Receber mensagens
        ws.on("message", async (data) => {
            try {
                const message = JSON.parse(data.toString());
                console.log(`[${new Date().toISOString()}] Mensagem recebida:`, JSON.stringify(message));
                await handleMessage(ws, message, wss);
            } catch (error) {
                console.error("Erro ao processar mensagem:", error);
                ws.send(JSON.stringify({ error: "Invalid message format" }));
            }
        });

        // Desconexão
        ws.on("close", async () => {
            if (ws.isDevice && ws.deviceId) {
                console.log(`[${new Date().toISOString()}] ESP8266 desconectado: ${ws.deviceId}`);

                const device = await Device.findOne({ deviceId: ws.deviceId });
                if (device) {
                    await Event.create({
                        deviceId: ws.deviceId,
                        userId: device.owner,
                        event: "deviceDisconnected",
                        data: {},
                        timestamp: new Date()
                    });
                }
            } else {
                console.log(`[${new Date().toISOString()}] Cliente desconectado.`);
            }
        });

        // Heartbeat
        const interval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.ping();
            }
        }, 30000);

        ws.on("close", () => clearInterval(interval));
    });

    console.log("WebSocket server iniciado em /ws");
    return wss;
}

async function handleMessage(
    ws: WebSocketClient,
    message: any,
    wss: WebSocketServer
) {
    const { event, deviceId } = message;
    // Mensagens do ESP8266
    if (ws.isDevice) {
        switch (event) {
            case "buttonPress":
                await handleButtonPress(ws, message, wss);
                break;

            case "buffer":
                await handleBuffer(ws, message, wss);
                break;

            case "combo":   
                await handleComboEvent(ws, message, wss);
                break;

            case "comboCompleted":
                await handleComboCompleted(ws, message, wss);
                break;

            case "ping":
                ws.send(JSON.stringify({ event: "pong", timestamp: new Date().toISOString() }));
                break;

            default:
                ws.send(JSON.stringify({ error: "Unknown event type" }));
        }
    }
    // Mensagens do frontend
    else {
        switch (event) {
            case "subscribe":
                ws.deviceId = message.deviceId;
                ws.send(JSON.stringify({
                    event: "subscribed",
                    deviceId: message.deviceId
                }));
                break;

            default:
                ws.send(JSON.stringify({ error: "Unknown event type" }));
        }
    }
}
async function handleButtonPress(
    ws: WebSocketClient,
    message: any,
    wss: WebSocketServer
) {
    const { deviceId, data, timestamp } = message;

    if (!deviceId) {
        ws.send(JSON.stringify({ error: "Missing deviceId" }));
        return;
    }

    if (!data) {
        ws.send(JSON.stringify({ error: "Missing data" }));
        return;
    }

    const { buttonId, color } = data.sequence;

    if (buttonId === undefined) {
        ws.send(JSON.stringify({ error: "Missing buttonId" }));
        return;
    }

    const device = await Device.findOne({ deviceId });
    if (!device) {
        ws.send(JSON.stringify({ error: "Device not found" }));
        return;
    }

    // Mapear emoção baseado no buttonId
    const mappedEmotion = device.config.buttons[buttonId] || color || "unknown";

    // Salvar evento de botão pressionado
    const event = await Event.create({
        deviceId,
        userId: device.owner,
        event: "buttonPress",
        data: {
            buttonId,
            color,
            emotion: mappedEmotion
        },
        timestamp: new Date(timestamp || Date.now())
    });

    // Garantir combos do usuário
    if (!device.config.combos || device.config.combos.length === 0) {
        device.config.combos = DEFAULT_COMBOS;
    }

    const detector = new ComboDetector(device);
    const comboResult = detector.addButton(buttonId);

    // Resposta base
    const response: any = {
        event: "buttonPressConfirmed",
        buttonId,
        color,
        emotion: mappedEmotion,
        timestamp: new Date().toISOString(),
        sequence: comboResult.currentSequence
    };

    // Se completou um combo
    if (comboResult.completed && comboResult.combo) {
        // Salvar evento de combo
        const comboEvent = await Event.create({
            deviceId,
            userId: device.owner,
            event: "comboCompleted",
            data: {
                sequence: comboResult.combo.sequence,
                message: comboResult.combo.message,
                category: comboResult.combo.category
            },
            timestamp: new Date()
        });

        response.combo = {
            completed: true,
            sequence: comboResult.combo.sequence,
            message: comboResult.combo.message,
            category: comboResult.combo.category
        };

        // Broadcast combo para frontend
        broadcastToFrontend(wss, device.owner.toString(), deviceId, {
            event: "comboCompleted",
            data: {
                id: comboEvent._id,
                deviceId,
                sequence: comboResult.combo.sequence,
                message: comboResult.combo.message,
                category: comboResult.combo.category,
                timestamp: comboEvent.timestamp
            }
        });

        console.log(`[${new Date().toISOString()}] 🎯 COMBO - Device: ${deviceId}, Mensagem: "${comboResult.combo.message}"`);
    } else if (comboResult.currentSequence.length > 0) {
        response.combo = {
            completed: false,
            progress: comboResult.currentSequence
        };
    }

    // Confirmar para ESP8266
    ws.send(JSON.stringify(response));

    // Broadcast botão para frontend
    broadcastToFrontend(wss, device.owner.toString(), deviceId, {
        event: "buttonPress",
        data: {
            id: event._id,
            deviceId,
            buttonId,
            color,
            emotion: mappedEmotion,
            timestamp: event.timestamp,
            comboProgress: comboResult.currentSequence
        }
    });

    console.log(`[${new Date().toISOString()}] Botão - Device: ${deviceId}, Botão: ${buttonId} (${color}), Sequência: [${comboResult.currentSequence.join(", ")}]`);
}

async function handleBuffer(
    ws: WebSocketClient,
    message: any,
    wss: WebSocketServer
) {
    const { deviceId, items } = message;

    if (!deviceId || !Array.isArray(items)) {
        ws.send(JSON.stringify({ error: "Invalid buffer format" }));
        return;
    }

    console.log(`[${new Date().toISOString()}] Buffer recebido - Device: ${deviceId}, Items: ${items.length}`);

    const device = await Device.findOne({ deviceId });
    if (!device) {
        ws.send(JSON.stringify({ error: "Device not found" }));
        return;
    }

    let processedCount = 0;
    let errors = 0;

    // Processar cada item do buffer
    for (const item of items) {
        try {
            const { event, data, timestamp } = item;

            if (event === "buttonPress" && data) {
                const { buttonId, color } = data;
                const mappedEmotion = device.config.buttons[buttonId] || color || "unknown";

                // Salvar evento
                const savedEvent = await Event.create({
                    deviceId,
                    userId: device.owner,
                    event: "buttonPress",
                    data: {
                        buttonId,
                        color,
                        emotion: mappedEmotion
                    },
                    timestamp: new Date(timestamp || Date.now())
                });

                // Broadcast para frontend
                broadcastToFrontend(wss, device.owner.toString(), deviceId, {
                    event: "buttonPress",
                    data: {
                        id: savedEvent._id,
                        deviceId,
                        buttonId,
                        color,
                        emotion: mappedEmotion,
                        timestamp: savedEvent.timestamp,
                        fromBuffer: true
                    }
                });

                processedCount++;
            }
        } catch (error) {
            console.error("Erro ao processar item do buffer:", error);
            errors++;
        }
    }

    // Confirmar processamento do buffer
    ws.send(JSON.stringify({
        event: "bufferProcessed",
        deviceId,
        processed: processedCount,
        errors,
        timestamp: new Date().toISOString()
    }));

    console.log(`[${new Date().toISOString()}] Buffer processado - Device: ${deviceId}, Sucesso: ${processedCount}, Erros: ${errors}`);
}

async function handleComboCompleted(
    ws: WebSocketClient,
    message: any,
    wss: WebSocketServer
) {
    const { deviceId, data, timestamp } = message;
    const { sequence, comboName, comboMessage } = data;

    if (!deviceId || !sequence) {
        ws.send(JSON.stringify({ error: "Missing data" }));
        return;
    }

    const device = await Device.findOne({ deviceId });
    if (!device) {
        ws.send(JSON.stringify({ error: "Device not found" }));
        return;
    }

    // Salvar evento
    const event = await Event.create({
        deviceId,
        userId: device.owner,
        event: "comboCompleted",
        data: {
            comboName,
            sequence,
            message: comboMessage
        },
        timestamp: new Date(timestamp || Date.now())
    });

    // Confirmar
    ws.send(JSON.stringify({
        event: "comboCompletedConfirmed",
        comboName,
        message: comboMessage,
        timestamp: new Date().toISOString()
    }));

    // Broadcast
    broadcastToFrontend(wss, device.owner.toString(), deviceId, {
        event: "comboCompleted",
        data: {
            id: event._id,
            deviceId,
            comboName,
            sequence,
            message: comboMessage,
            timestamp: event.timestamp
        }
    });

    console.log(`[${new Date().toISOString()}] Combo - Device: ${deviceId}, Nome: ${comboName}`);
}

function broadcastToFrontend(
    wss: WebSocketServer,
    userId: string,
    deviceId: string,
    message: any
) {
    wss.clients.forEach((client: WebSocket) => {
        const wsClient = client as WebSocketClient;

        if (
            wsClient.readyState === WebSocket.OPEN &&
            !wsClient.isDevice &&
            wsClient.userId === userId &&
            (wsClient.deviceId === deviceId || !wsClient.deviceId)
        ) {
            wsClient.send(JSON.stringify(message));
        }
    });
}

async function handleComboEvent(
    ws: WebSocketClient,
    message: any,
    wss: WebSocketServer
) {
    const { deviceId, sequence, timestamp } = message;

    if (!deviceId || !Array.isArray(sequence)) {
        ws.send(JSON.stringify({ error: "Missing data for combo" }));
        return;
    }

    const device = await Device.findOne({ deviceId });
    if (!device) {
        ws.send(JSON.stringify({ error: "Device not found" }));
        return;
    }

    const processedSequence: number[] = [];
    const detailedSequence: any[] = [];

    // Processa cada botão da sequência
    for (const btn of sequence) {
        const { buttonId, color } = btn;
        if (buttonId === undefined) continue;

        const mappedEmotion = device.config.buttons[buttonId] || color || "unknown";

        // Salvar evento individual de botão pressionado
        await Event.create({
            deviceId,
            userId: device.owner,
            event: "buttonPress",
            data: { buttonId, color, emotion: mappedEmotion },
            timestamp: new Date(timestamp || Date.now())
        });

        processedSequence.push(buttonId);
        detailedSequence.push({ buttonId, color, emotion: mappedEmotion });
    }

    // Verifica se algum combo do dispositivo foi completado
    let matchedCombo: ICombo | null = null;
    for (const combo of device.config.combos) {
        if (combo.sequence.length === processedSequence.length &&
            combo.sequence.every((id, idx) => id === processedSequence[idx])
        ) {
            matchedCombo = combo;
            break;
        }
    }

    // Salvar evento de combo (referenciando combo cadastrado, se houver)
    const comboEvent = await Event.create({
        deviceId,
        userId: device.owner,
        event: "comboCompleted",
        data: {
            sequence: processedSequence,
            message: matchedCombo?.message || `Combo de ${processedSequence.length} botões`,
            category: matchedCombo?.category
        },
        timestamp: new Date(timestamp || Date.now())
    });

    // Confirmar para ESP8266
    ws.send(JSON.stringify({
        event: "comboConfirmed",
        sequence: detailedSequence,
        combo: matchedCombo ? {
            message: matchedCombo.message,
            category: matchedCombo.category
        } : null,
        timestamp: new Date().toISOString()
    }));

    // Broadcast para frontends
    broadcastToFrontend(wss, device.owner.toString(), deviceId, {
        event: "comboCompleted",
        data: {
            id: comboEvent._id,
            deviceId,
            sequence: detailedSequence,
            message: matchedCombo?.message || `Combo de ${processedSequence.length} botões`,
            category: matchedCombo?.category,
            timestamp: comboEvent.timestamp
        }
    });

    console.log(`[${new Date().toISOString()}] Combo processado - Device: ${deviceId}, Sequência:`, detailedSequence, matchedCombo ? `, Combo: ${matchedCombo.message}` : '');
}




