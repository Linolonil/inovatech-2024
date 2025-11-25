import mongoose from "mongoose";

const comboSchema = new mongoose.Schema({
    deviceId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    sequence: { type: [Number], required: true },
    message: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Combo", comboSchema);
