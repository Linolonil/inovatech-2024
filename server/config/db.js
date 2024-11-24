import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("[MongoDB] Conectado com sucesso.");
  } catch (error) {
    console.error("[MongoDB] Erro ao conectar:", error);
    process.exit(1); // Exit with failure
  }
};

export default connectDB;
