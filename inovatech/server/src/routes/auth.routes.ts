import { Router } from "express";
import { login, register } from "../controllers/auth.controller";

const r = Router();
r.post("/register", register);
r.post("/login", login);
export default r;
