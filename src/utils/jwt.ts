import jwt from "jsonwebtoken";
import { env } from "../config/env"
import { JwtPayload } from "jsonwebtoken";

export interface TokenPayload extends JwtPayload {
    userId: string;
    email: string;
}

export const signToken = ({ userId, email }: {
    userId: string;
    email: string;
}) => {
    const payload = { userId, email };
    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as any });

    return token
};


export const verifyToken = (token: string): TokenPayload => {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
}