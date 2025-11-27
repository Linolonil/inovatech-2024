import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";

export function signToken(
  payload: JwtPayload,
  secret: string,
  expiresIn: string | number = "7d"
) {
  const options: SignOptions = { expiresIn: expiresIn as any };
  return jwt.sign(payload, secret, options);
}

export function verifyToken(token: string, secret: string) {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    return null;
  }
}