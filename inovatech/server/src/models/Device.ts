import mongoose from "mongoose";

export interface IDevice {
    deviceId: string;      // ex: CTRL-893742
    owner: mongoose.Types.ObjectId;
    name?: string;
    config?: {
        buttons: Record<number, string>; // buttonId => meaning
        combos?: {
            name: string;
            sequence: number[];
            message: string;
        }[];
    };
}

const deviceSchema = new mongoose.Schema<IDevice>({
    deviceId: { type: String, required: true, unique: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    config: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

export default mongoose.model<IDevice & mongoose.Document>("Device", deviceSchema);
