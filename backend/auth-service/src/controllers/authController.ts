import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const validateToken = (req: Request, res: Response) => {
    res.status(200).send({ userId: req.userId });
};

export const logout = (req: Request, res: Response) => {
    res.cookie("auth_token", "", { expires: new Date(0) });
    res.sendStatus(200);
};
