import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);
app.use(cookieParser());
app.use(routes);

export default app;
