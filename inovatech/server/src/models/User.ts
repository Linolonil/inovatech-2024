import { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
    _id: Schema.Types.ObjectId;
    email: string;
    password: string;
    name?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        name: { type: String }
    },
    {
        timestamps: true
    }
);

const User = model<IUser>("User", userSchema);

export default User;