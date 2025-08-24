import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { verifyToken } from "./middleware/auth";
import { validateToken, logout } from "./controllers/authController";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.get("/validate-token", verifyToken, validateToken);
app.post("/logout", logout);

export default app;
