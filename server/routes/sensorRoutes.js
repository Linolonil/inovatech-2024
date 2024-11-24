import express from "express";
import { criarSensor, consultarSensor, removerSensor, atualizaSensor } from "../controllers/sensorController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",authMiddleware, criarSensor);
router.get("/:sensorId",authMiddleware, consultarSensor);
router.put("/:sensorId",authMiddleware, atualizaSensor);
router.delete("/:userId/:sensorId",authMiddleware, removerSensor); 

export default router;
