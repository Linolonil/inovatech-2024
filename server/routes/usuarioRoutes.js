import express from "express";
import { criarUsuario, consultarSensoresUsuario, atualizarUsuario, deletarUsuario } from "../controllers/usuarioController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", criarUsuario);
router.get("/:userId/sensores",authMiddleware, consultarSensoresUsuario);
router.put("/:userId",authMiddleware, atualizarUsuario); 
router.delete("/:userId",authMiddleware, deletarUsuario);

export default router;
