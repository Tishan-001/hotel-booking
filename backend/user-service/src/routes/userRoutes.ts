import express from "express";
import {
    login,
    register,
    getCurrentUser,
} from "../controllers/userController";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", verifyToken, getCurrentUser);

export default router;
