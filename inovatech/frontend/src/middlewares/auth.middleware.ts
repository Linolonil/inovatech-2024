import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { verifyToken } from "../utils/jwt";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: "no token" });
    const token = header.replace("Bearer ", "");
    const payload = verifyToken(token, process.env.JWT_SECRET!);
    if (!payload) return res.status(401).json({ error: "invalid token" });
    // attach user
    // @ts-ignore
    req.user = await User.findById((payload as any).id);
    next();
}
