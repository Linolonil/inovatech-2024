import { Schema } from "mongoose";
import { DEFAULT_BUTTON_MAPPING, DEFAULT_COMBOS } from "../config/defaultCombos";
import Device from "../models/Device";

export async function createDefaultDevice(userId: Schema.Types.ObjectId, deviceId: string, name?: string) {
    const device = await Device.create({
        deviceId,
        owner: userId,
        name: name || "Meu Dispositivo",
        config: {
            buttons: DEFAULT_BUTTON_MAPPING,
            combos: DEFAULT_COMBOS,
            comboTimeout: 3000
        }
    });

    return device;
}

export function getDefaultCombos() {
    return DEFAULT_COMBOS;
}

export function getDefaultButtonMapping() {
    return DEFAULT_BUTTON_MAPPING;
}