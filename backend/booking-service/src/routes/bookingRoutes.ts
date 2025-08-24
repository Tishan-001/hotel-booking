import express from "express";
import {
    createPaymentIntent,
    createBooking,
    getUserBookings,
} from "../controllers/bookingController";

const router = express.Router();

router.post("/payment-intent", createPaymentIntent);
router.post("/", createBooking);
router.get("/", getUserBookings);

export default router;
