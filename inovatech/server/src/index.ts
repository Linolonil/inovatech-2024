import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import deviceRoutes from "./routes/device.routes";
import eventRoutes from "./routes/event.routes";

import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";
import { setupWebSocket } from "./ws/websocket";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const swaggerDocument = YAML.load("./src/docs/swagger.yaml");
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/events", eventRoutes);

const server = http.createServer(app);
setupWebSocket(server);

const PORT = process.env.PORT || 3000;

(async () => {
    await connectDB(process.env.MONGODB_URI!);
    server.listen(PORT, () => {
        console.log(`Server rodando papai, on http://localhost:${PORT}`);
    });
})();
