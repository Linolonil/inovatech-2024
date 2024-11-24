import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/", (req, res) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ valid: false, message: "Token não fornecido." });
  }

  const token = authHeader.split(' ')[1]; 
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.status(200).json({ valid: true, decoded });
    
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ valid: false, message: "Token expirado." });
    }
    res.status(401).json({ valid: false, message: "Token inválido ou expirado." });
  }
});

export default router;