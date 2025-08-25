import express from "express";
import cors from "cors";
import notificationRoutes from "./routes/notificationRoutes";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();

app.use(cors());
app.use(express.json());
app.use("/notifications", notificationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'Notifications Service',
        timestamp: new Date().toISOString()
    });
});

export default app;