import mongoose from "mongoose";

export async function connectDB(uri: string) {
    mongoose.set("strictQuery", false);
    await mongoose.connect(uri);
    console.log("✅ MongoDB conectado");
}
