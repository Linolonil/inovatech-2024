import { Request, Response } from "express";
import { Schema } from "mongoose";
import Device from "../models/Device";
import Event from "../models/Event";

interface AuthRequest extends Request {
    user?: {
        _id: Schema.Types.ObjectId;
        email: string;
    };
}

export async function createEvent(req: AuthRequest, res: Response) {
    try {
        const { deviceId, type, data, timestamp } = req.body;

        // Validar dispositivo existe e pertence ao usuário
        const device = await Device.findOne({ deviceId });
        if (!device) {
            return res.status(404).json({ error: "Dispositivo não encontrado" });
        }

        const event = await Event.create({
            deviceId,
            userId: device.owner,
            type,
            data,
            timestamp: timestamp || new Date()
        });

        res.status(201).json(event);
    } catch (error) {
        console.error("Erro ao criar evento:", error);
        res.status(500).json({ error: "Erro ao registrar evento" });
    }
}

// Listar eventos de um dispositivo
export async function getDeviceEvents(req: AuthRequest, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Não autenticado" });
        }

        const { deviceId } = req.params;
        const { limit = "50", startDate, endDate, type } = req.query;

        // Verificar se o device pertence ao usuário
        const device = await Device.findOne({
            deviceId,
            owner: req.user._id
        });

        if (!device) {
            return res.status(404).json({ error: "Dispositivo não encontrado" });
        }

        // Construir query
        const query: any = { deviceId };

        if (type) {
            query.type = type;
        }

        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate as string);
            if (endDate) query.timestamp.$lte = new Date(endDate as string);
        }

        const events = await Event.find(query)
            .sort({ timestamp: -1 })
            .limit(parseInt(limit as string))
            .select("-__v");

        res.json(events);
    } catch (error) {
        console.error("Erro ao buscar eventos:", error);
        res.status(500).json({ error: "Erro ao buscar eventos" });
    }
}

// Analytics: Resumo de emoções por período
export async function getEmotionsSummary(req: AuthRequest, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Não autenticado" });
        }

        const { deviceId } = req.params;
        const { startDate, endDate } = req.query;

        // Verificar ownership
        const device = await Device.findOne({
            deviceId,
            owner: req.user._id
        });

        if (!device) {
            return res.status(404).json({ error: "Dispositivo não encontrado" });
        }

        // Construir match para agregação
        const match: any = {
            deviceId,
            type: "buttonPress"
        };

        if (startDate || endDate) {
            match.timestamp = {};
            if (startDate) match.timestamp.$gte = new Date(startDate as string);
            if (endDate) match.timestamp.$lte = new Date(endDate as string);
        }

        // Agregação para contar emoções
        const summary = await Event.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$data.emotion",
                    count: { $sum: 1 },
                    lastOccurrence: { $max: "$timestamp" }
                }
            },
            { $sort: { count: -1 } },
            {
                $project: {
                    _id: 0,
                    emotion: "$_id",
                    count: 1,
                    lastOccurrence: 1
                }
            }
        ]);

        res.json({
            deviceId,
            period: {
                start: startDate || "all",
                end: endDate || "now"
            },
            summary
        });
    } catch (error) {
        console.error("Erro ao gerar resumo:", error);
        res.status(500).json({ error: "Erro ao gerar resumo" });
    }
}

// Timeline: Eventos agrupados por dia
export async function getTimeline(req: AuthRequest, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Não autenticado" });
        }

        const { deviceId } = req.params;
        const { days = "7" } = req.query;

        const device = await Device.findOne({
            deviceId,
            owner: req.user._id
        });

        if (!device) {
            return res.status(404).json({ error: "Dispositivo não encontrado" });
        }

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days as string));

        const timeline = await Event.aggregate([
            {
                $match: {
                    deviceId,
                    type: "buttonPress",
                    timestamp: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                        emotion: "$data.emotion"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.date",
                    emotions: {
                        $push: {
                            emotion: "$_id.emotion",
                            count: "$count"
                        }
                    },
                    totalEvents: { $sum: "$count" }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    emotions: 1,
                    totalEvents: 1
                }
            }
        ]);

        res.json({
            deviceId,
            days: parseInt(days as string),
            timeline
        });
    } catch (error) {
        console.error("Erro ao gerar timeline:", error);
        res.status(500).json({ error: "Erro ao gerar timeline" });
    }
}