import mongoose from "mongoose";

export interface IEvent {
    deviceId: string;
    type: string; // "buttonPress"
    data: any;
    timestamp: Date;
}

const eventSchema = new mongoose.Schema<IEvent>({
    deviceId: { type: String, required: true },
    type: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed },
    timestamp: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model<IEvent & mongoose.Document>("Event", eventSchema);
