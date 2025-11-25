import { Request, Response } from "express";
import Device from "../models/Device";

export async function createDevice(req: Request, res: Response) {
    // @ts-ignore
    const owner = req.user._id;
    const { deviceId, name } = req.body;
    if (!deviceId) return res.status(400).json({ error: "deviceId required" });
    const exists = await Device.findOne({ deviceId });
    if (exists) return res.status(400).json({ error: "device exists" });

    const device = await Device.create({ deviceId, owner, name, config: { buttons: {} } });
    res.json(device);
}

export async function updateConfig(req: Request, res: Response) {
    const { deviceId } = req.params;
    // @ts-ignore
    const owner = req.user._id;
    const device = await Device.findOne({ deviceId, owner });
    if (!device) return res.status(404).json({ error: "not found" });
    device.config = { ...device.config, ...req.body.config };
    await device.save();
    res.json(device);
}
