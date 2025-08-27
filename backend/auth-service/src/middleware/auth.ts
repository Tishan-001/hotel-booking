import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

declare global {
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}

export const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies["auth_token"];

    if (!token) {
        return res.status(401).json({ message: "unauthorized" });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
        const userId = (decode as JwtPayload).userId;

        req.userId = userId;
        req.headers["x-user-id"] = userId;

        next();
    } catch (error) {
        return res.status(401).json({ message: "unauthorized" });
    }
};

