import express from "express";
import mongoose from "mongoose";
import hotelRoutes from "./routes/hotelRoutes";
import myHotelsRoutes from "./routes/myHotelsRoutes";

const app = express();

app.use(express.json());
app.use("/", hotelRoutes);
app.use("/my", myHotelsRoutes);

// Connect to database
mongoose
    .connect(process.env.MONGODB_CONNECTION_STRING as string)
    .then(() => console.log("Connected to Hotels database"))
    .catch((err) => console.error("Database connection error:", err));

export default app;
