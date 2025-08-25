import express from "express";
import {
    sendBookingConfirmation,
    testEmailConnection,
    sendTestEmail
} from "../controllers/notificationController";

const router = express.Router();

router.post("/booking-confirmation", sendBookingConfirmation);

router.get("/test-connection", testEmailConnection);

router.post("/test-email", sendTestEmail);

export default router;