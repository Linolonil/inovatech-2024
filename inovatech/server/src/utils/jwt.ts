import jwt from "jsonwebtoken";

export function signToken(payload: object, secret: string, expiresIn = "7d") {
    return jwt.sign(payload, secret, { expiresIn });
}

export function verifyToken(token: string, secret: string) {
    try {
        return jwt.verify(token, secret);
    } catch {
        return null;
    }
}
