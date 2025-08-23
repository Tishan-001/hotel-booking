import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.get("/me", verifyToken, async (req: Request, res: Response) => {
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
});

router.post(
    "/register",
    [
        check("firstName", "First Name Is Required").isString(),
        check("lastName", "Last Name Is Required").isString(),
        check("email", "Email Is Required").isEmail(),
        check(
            "password",
            "Password With 6 Or More Characters Required"
        ).isLength({ min: 6 }),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        try {
            let user = await User.findOne({ email: req.body.email });

            if (user) {
                return res.status(400).send({
                    message: "Email already exists!",
                });
            }

            user = new User(req.body);
            await user.save();

            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET_KEY as string,
                {
                    expiresIn: "1d",
                }
            );

            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 86400000,
            });

            return res.status(200).send({ message: "User Registered Ok" });
        } catch (err) {
            res.status(500).send({ message: "Something Went Wrong!" });
        }
    }
);

export default router;
