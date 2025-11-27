import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import { signToken } from "../utils/jwt";

const SALT = 10;

export async function register(req: Request, res: Response) {
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email e senha são obrigatórios" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Email inválido" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Senha deve ter no mínimo 6 caracteres" });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ error: "Email já cadastrado" });
        }

        const hash = await bcrypt.hash(password, SALT);
        const user = await User.create({ email, password: hash, name });

        const token = signToken({ id: user._id }, process.env.JWT_SECRET!);

        res.status(201).json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            },
            token,
            message: "Usuário criado com sucesso! Configure seu dispositivo para começar."
        });
    } catch (error) {
        console.error("Erro no registro:", error);
        res.status(500).json({ error: "Erro ao registrar usuário" });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }) as IUser | null;
        if (!user) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }

        const token = signToken({ id: user._id }, process.env.JWT_SECRET!);
        res.json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            },
            token
        });
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ error: "Erro ao fazer login" });
    }
}