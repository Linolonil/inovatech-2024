import { Router } from "express";
import { createDevice, updateConfig } from "../controllers/device.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const r = Router();
r.post("/", requireAuth, createDevice);
r.put("/:deviceId/config", requireAuth, updateConfig);
export default r;
