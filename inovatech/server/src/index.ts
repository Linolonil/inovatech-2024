import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import deviceRoutes from "./routes/device.routes";
import { initializeWebSocket } from "./ws/websocket";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);

const server = http.createServer(app);

initializeWebSocket(server);

const PORT = process.env.PORT || 3000;
(async () => {
    await connectDB(process.env.MONGODB_URI!);
    server.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
})();
