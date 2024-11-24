// routes/apiRoutes.js
import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ status: "success", message: "Servidor ativo!" });
});

export default router;
