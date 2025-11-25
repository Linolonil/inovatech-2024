import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import User from "../models/User";
import { signToken } from "../utils/jwt";

const SALT = 10;

export async function register(req: Request, res: Response) {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: "missing" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "email exists" });

    const hash = await bcrypt.hash(password, SALT);
    const user = await User.create({ email, password: hash, name });
    const token = signToken({ id: user._id }, process.env.JWT_SECRET!);
    res.json({ user: { id: user._id, email }, token });
}

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "invalid" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "invalid" });

    const token = signToken({ id: user._id }, process.env.JWT_SECRET!);
    res.json({ user: { id: user._id, email }, token });
}
