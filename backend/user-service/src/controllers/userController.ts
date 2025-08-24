/// <reference path="../types/express.d.ts" />

import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const login = [
    check("email", "Email Is Required").isEmail(),
    check("password", "Password With 6 Or More Characters Required").isLength({ min: 6 }),
    
    async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ message: "Invalid Credentials!" });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: "Invalid Credentials!" });
            }

            const token = jwt.sign(
                { userId: user._id.toString() },
                process.env.JWT_SECRET_KEY as string,
                { expiresIn: "1d" }
            );

            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 86400000,
            });

            res.status(200).json({ userId: user._id });
        } catch (err) {
            console.error("Login error:", err);
            return res.status(500).json({ message: "Something Went Wrong!" });
        }
    }
];

export const register = [
    check("firstName", "First Name Is Required").isString(),
    check("lastName", "Last Name Is Required").isString(),
    check("email", "Email Is Required").isEmail(),
    check("password", "Password With 6 Or More Characters Required").isLength({
        min: 6,
    }),

    async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            let user = await User.findOne({ email: req.body.email });

            if (user) {
                return res
                    .status(400)
                    .send({ message: "Email already exists!" });
            }

            user = new User(req.body);
            await user.save();

            const token = jwt.sign(
                { userId: user._id.toString() },
                process.env.JWT_SECRET_KEY as string,
                { expiresIn: "1d" }
            );

            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 86400000,
            });

            return res
                .status(200)
                .send({ message: "User Registered OK", userId: user._id });
        } catch (err) {
            console.error("Registration error:", err);
            res.status(500).send({ message: "Something Went Wrong!" });
        }
    },
];

export const getCurrentUser = async (req: Request, res: Response) => {
    const userId = req.userId;

    try {
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(400).json({ message: "User Not Found" });
        }

        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something Went Wrong" });
    }
};




