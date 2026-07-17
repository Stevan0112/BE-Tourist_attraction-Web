import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JwtPayload { //Bisa pakai UserPayLoad
    userId: number;
    username: string;
    role: string;
}

export interface AuthRequest extends Request {
    user?: JwtPayload; //Bisa pakai UserPayLoad
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({
            success: false,
            message: "Token tidak ditemukan",
        });
        return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({
            success: false,
            message: "Token tidak valid"
        });
        return;
    }

    try {
        const decoded = jwt.verify(
            token,
            JWT_SECRET
        ) as JwtPayload; //Bisa pakai as unknown as UserPayLoad

    req.user = decoded;

    next();
    } catch {
        res.status(401).json({
            success: false,
            message: "Token tidak valid",
        });
    }
};