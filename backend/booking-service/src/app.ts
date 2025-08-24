import express from "express";
import mongoose from "mongoose";
import bookingRoutes from "./routes/bookingRoutes";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();

app.use(express.json());
app.use("/bookings", bookingRoutes);

// Connect to database
mongoose
    .connect(process.env.MONGODB_CONNECTION_STRING_BOOKINGS as string)
    .then(() => console.log("Connected to Bookings database"))
    .catch((err) => console.error("Database connection error:", err));

export default app;
