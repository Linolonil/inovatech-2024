import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: "no token" });
    const token = header.replace("Bearer ", "");
    const payload = verifyToken(token, process.env.JWT_SECRET!);
    if (!payload) return res.status(401).json({ error: "invalid token" });
    // attach user
    // @ts-ignore

    req.user = {
        _id: "69274f78fc00104c4c28204b",
        email: "usuario@exemplo.com",
        name: "João Silva"
    };
    next();
}
