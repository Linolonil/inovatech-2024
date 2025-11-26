import mongoose, { Document, Schema } from "mongoose";

export interface IEvent extends Document {
    _id: Schema.Types.ObjectId;
    deviceId: string;
    userId: Schema.Types.ObjectId;
    event: "buttonPress" | "comboCompleted" | "deviceConnected" | "deviceDisconnected";
    data: {
        buttonId?: number;
        color?: string;
        emotion?: string;
        comboName?: string;
        sequence?: number[];
        message?: string;
        metadata?: Record<string, any>;
    };
    timestamp: Date;
    createdAt?: Date;
}

const eventSchema = new Schema<IEvent>(
    {
        deviceId: { type: String, required: true, index: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        event: {
            type: String,
            required: true,
            enum: ["buttonPress", "comboCompleted", "deviceConnected", "deviceDisconnected"]
        },
        data: {
            buttonId: Number,
            color: String, 
            emotion: String,
            comboName: String,
            sequence: [Number],
            message: String,
            metadata: Schema.Types.Mixed
        },
        timestamp: { type: Date, required: true, index: true }
    },
    {
        timestamps: { createdAt: true, updatedAt: false }
    }
);

eventSchema.index({ deviceId: 1, timestamp: -1 });
eventSchema.index({ userId: 1, timestamp: -1 });

const Event = mongoose.model<IEvent>("Event", eventSchema);

export default Event;