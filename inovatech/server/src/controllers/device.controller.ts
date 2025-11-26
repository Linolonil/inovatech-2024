import { Request, Response } from "express";
import { Schema } from "mongoose";
import { DEFAULT_BUTTON_MAPPING, DEFAULT_COMBOS } from "../config/defaultCombos";
import Device, { IDevice } from "../models/Device";
import { ComboDetector } from "../services/combo.service";

interface AuthRequest extends Request {
    user?: {
        _id: Schema.Types.ObjectId;
        email: string;
    };
}

export async function createDevice(req: AuthRequest, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Não autenticado" });
        }

        const owner = req.user._id;
        const { deviceId, name } = req.body;

        if (!deviceId) {
            return res.status(400).json({ error: "deviceId é obrigatório" });
        }

        if (typeof deviceId !== "string" || deviceId.trim().length === 0) {
            return res.status(400).json({ error: "deviceId inválido" });
        }

        const exists = await Device.findOne({ deviceId });
        if (exists) {
            return res.status(400).json({ error: "Dispositivo já cadastrado" });
        }

        const device = await Device.create({
            deviceId: deviceId.trim(),
            owner,
            name: name?.trim() || "Meu Dispositivo",
            config: {
                buttons: DEFAULT_BUTTON_MAPPING,
                combos: DEFAULT_COMBOS,
                comboTimeout: 3000
            }
        });

        res.status(201).json({
            id: device._id,
            deviceId: device.deviceId,
            name: device.name,
            config: device.config,
            createdAt: device.createdAt,
            message: `Dispositivo criado com ${DEFAULT_COMBOS.length} combos padrão!`
        });
    } catch (error) {
        console.error("Erro ao criar device:", error);
        res.status(500).json({ error: "Erro ao criar dispositivo" });
    }
}

export async function updateConfig(req: AuthRequest, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Não autenticado" });
        }

        const { deviceId } = req.params;
        const owner = req.user._id;
        const { config } = req.body;

        if (!config) {
            return res.status(400).json({ error: "config é obrigatório" });
        }

        const device = await Device.findOne({ deviceId, owner }) as IDevice | null;
        if (!device) {
            return res.status(404).json({ error: "Dispositivo não encontrado" });
        }

        device.config = {
            buttons: { ...device.config.buttons, ...config.buttons },
            combos: config.combos || device.config.combos
        };

        await device.save();

        res.json({
            id: device._id,
            deviceId: device.deviceId,
            name: device.name,
            config: device.config,
            updatedAt: device.updatedAt
        });
    } catch (error) {
        console.error("Erro ao atualizar config:", error);
        res.status(500).json({ error: "Erro ao atualizar configuração" });
    }
}

export async function listDevices(req: AuthRequest, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Não autenticado" });
        }

        const devices = await Device.find({ owner: req.user._id })
            .select("-__v")
            .sort({ createdAt: -1 });

        res.json(devices);
    } catch (error) {
        console.error("Erro ao listar devices:", error);
        res.status(500).json({ error: "Erro ao listar dispositivos" });
    }
}

export async function getDevice(req: AuthRequest, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Não autenticado" });
        }

        const { deviceId } = req.params;
        const device = await Device.findOne({
            deviceId,
            owner: req.user._id
        }) as IDevice | null;

        if (!device) {
            return res.status(404).json({ error: "Dispositivo não encontrado" });
        }

        res.json(device);
    } catch (error) {
        console.error("Erro ao buscar device:", error);
        res.status(500).json({ error: "Erro ao buscar dispositivo" });
    }
}

export async function deleteDevice(req: AuthRequest, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Não autenticado" });
        }

        const { deviceId } = req.params;
        const device = await Device.findOneAndDelete({
            deviceId,
            owner: req.user._id
        });

        if (!device) {
            return res.status(404).json({ error: "Dispositivo não encontrado" });
        }

        res.json({ message: "Dispositivo removido com sucesso" });
    } catch (error) {
        console.error("Erro ao deletar device:", error);
        res.status(500).json({ error: "Erro ao remover dispositivo" });
    }
}

export async function resetCombosToDefault(req: AuthRequest, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Não autenticado" });
        }

        const { deviceId } = req.params;

        const device = await Device.findOne({ deviceId, owner: req.user._id });
        if (!device) {
            return res.status(404).json({ error: "Dispositivo não encontrado" });
        }

        device.config.combos = DEFAULT_COMBOS;
        device.config.buttons = DEFAULT_BUTTON_MAPPING;
        await device.save();

        res.json({
            deviceId: device.deviceId,
            message: `Configuração resetada para padrão com ${DEFAULT_COMBOS.length} combos`,
            config: device.config
        });
    } catch (error) {
        console.error("Erro ao resetar combos:", error);
        res.status(500).json({ error: "Erro ao resetar configuração" });
    }
}

export async function updateCombos(req: AuthRequest, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Não autenticado" });
        }

        const { deviceId } = req.params;
        const { combos } = req.body;

        if (!Array.isArray(combos)) {
            return res.status(400).json({ error: "combos deve ser um array" });
        }

        // Validar estrutura dos combos
        for (const combo of combos) {
            if (!Array.isArray(combo.sequence) || !combo.message) {
                return res.status(400).json({
                    error: "Cada combo deve ter sequence (array) e message (string)"
                });
            }

            // Validar que buttonIds estão entre 1-6
            if (combo.sequence.some((id: number) => id < 1 || id > 6)) {
                return res.status(400).json({
                    error: "ButtonIds devem estar entre 1 e 6"
                });
            }
        }

        const device = await Device.findOne({ deviceId, owner: req.user._id });
        if (!device) {
            return res.status(404).json({ error: "Dispositivo não encontrado" });
        }

        device.config.combos = combos;
        await device.save();

        res.json({
            deviceId: device.deviceId,
            combos: device.config.combos,
            message: "Combos atualizados com sucesso"
        });
    } catch (error) {
        console.error("Erro ao atualizar combos:", error);
        res.status(500).json({ error: "Erro ao atualizar combos" });
    }
}

export async function getCombos(req: AuthRequest, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Não autenticado" });
        }

        const { deviceId } = req.params;

        const device = await Device.findOne({ deviceId, owner: req.user._id });
        if (!device) {
            return res.status(404).json({ error: "Dispositivo não encontrado" });
        }

        const grouped = ComboDetector.getCombosByCategory(device);

        res.json({
            deviceId: device.deviceId,
            total: device.config.combos.length,
            combos: device.config.combos,
            byCategory: grouped
        });
    } catch (error) {
        console.error("Erro ao buscar combos:", error);
        res.status(500).json({ error: "Erro ao buscar combos" });
    }
}