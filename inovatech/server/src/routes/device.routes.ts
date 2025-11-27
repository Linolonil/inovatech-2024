import { Router } from "express";
import { createDevice, getCombos, getDevice, getDevices, resetCombosToDefault, updateCombos, updateConfig } from "../controllers/device.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const r = Router();
r.post("/", requireAuth, createDevice);
r.get("/", requireAuth, getDevices)
r.get("/:deviceId", requireAuth, getDevice);
r.put("/:deviceId", requireAuth, updateConfig)
r.put("/:deviceId/config", requireAuth, updateConfig);
r.get("/devices/:deviceId/combos", requireAuth, getCombos);
r.put("/devices/:deviceId/combos", requireAuth, updateCombos);
r.post("/devices/:deviceId/combos/reset", requireAuth, resetCombosToDefault);
export default r;
