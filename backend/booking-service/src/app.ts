import express from "express";
import mongoose from "mongoose";
import bookingRoutes from "./routes/bookingRoutes";

const app = express();

app.use(express.json());
app.use("/", bookingRoutes);

// Connect to database
mongoose
    .connect(process.env.MONGODB_CONNECTION_STRING as string)
    .then(() => console.log("Connected to Bookings database"))
    .catch((err) => console.error("Database connection error:", err));

export default app;
