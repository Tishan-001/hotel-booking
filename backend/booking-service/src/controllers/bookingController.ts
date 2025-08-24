import { Request, Response } from "express";
import Stripe from "stripe";
import { Booking } from "../models/booking";
import { createBookingSaga } from "../sagas/createBookingSaga";
import axios, { AxiosError } from "axios";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);
const HOTEL_SERVICE_URL =
    process.env.HOTEL_SERVICE_URL || "http://hotel-service:7003";

export const createPaymentIntent = async (req: Request, res: Response) => {
    try {
        const { numberOfNights } = req.body;
        const hotelId = req.params.hotelId;

        const response = await axios.get(
            `${HOTEL_SERVICE_URL}/hotels/${hotelId}`
        );
        const hotel = response.data;

        if (!hotel) {
            return res.status(400).json({ message: "Hotel Not Found" });
        }

        const totalCost = hotel.pricePerNight * numberOfNights;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalCost * 100), // Convert to cents
            currency: "gbp",
            metadata: {
                hotelId,
                userId: req.userId,
            },
        });

        if (!paymentIntent.client_secret) {
            return res
                .status(500)
                .json({ message: "Error Creating Payment Intent" });
        }

        res.send({
            paymentIntentId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret,
            totalCost,
        });
    } catch (error) {
        console.log(error);

        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                return res.status(400).json({ message: "Hotel Not Found" });
            }
            return res.status(error.response?.status || 500).json({
                message: "Hotel Service Communication Error",
            });
        }

        res.status(500).json({ message: "Something Went Wrong" });
    }
};

export const createBooking = async (req: Request, res: Response) => {
    try {
        const booking = await createBookingSaga(req.body);
        res.status(201).json(booking);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Unable to create booking" });
    }
};

export const getUserBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await Booking.find({ userId: req.userId });
        res.status(200).json(bookings);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Unable To Fetch Bookings" });
    }
};








