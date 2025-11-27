import { Router } from "express";
import { createDevice, getCombos, getDevices, resetCombosToDefault, updateCombos, updateConfig } from "../controllers/device.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const r = Router();
r.post("/", requireAuth, createDevice);
r.get("/", requireAuth, getDevices)
r.put("/:deviceId/config", requireAuth, updateConfig);
r.get("/devices/:deviceId/combos", requireAuth, getCombos);
r.put("/devices/:deviceId/combos", requireAuth, updateCombos);
r.post("/devices/:deviceId/combos/reset", requireAuth, resetCombosToDefault);
export default r;
