import { Router } from "express";
import {
    createEvent,
    getDeviceEvents,
    getEmotionsSummary,
    getTimeline
} from "../controllers/event.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const r = Router();

r.post("/events", createEvent);
r.get("/devices/:deviceId/events", requireAuth, getDeviceEvents);
r.get("/devices/:deviceId/analytics/summary", requireAuth, getEmotionsSummary);
r.get("/devices/:deviceId/analytics/timeline", requireAuth, getTimeline);

export default r;