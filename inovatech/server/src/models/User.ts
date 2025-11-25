import mongoose from "mongoose";

export interface IUser {
    email: string;
    password: string;
    name?: string;
}

const userSchema = new mongoose.Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String
}, { timestamps: true });

export default mongoose.model<IUser & mongoose.Document>("User", userSchema);
