import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());
app.use("/", userRoutes);

// Connect to database
mongoose
    .connect(process.env.MONGODB_CONNECTION_STRING as string)
    .then(() => console.log("Connected to Users database"))
    .catch((err) => console.error("Database connection error:", err));

export default app;
