import express from "express";
import mongoose from "mongoose";
import hotelRoutes from "./routes/hotelRoutes";
import myHotelsRoutes from "./routes/myHotelsRoutes";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();

app.use(express.json());
app.use("/my", myHotelsRoutes);
app.use("/", hotelRoutes);

// Connect to database
mongoose
    .connect(process.env.MONGODB_CONNECTION_STRING_HOTELS as string)
    .then(() => console.log("Connected to Hotels database"))
    .catch((err) => console.error("Database connection error:", err));

export default app;
