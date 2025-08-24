/// <reference path="../types/express.d.ts" />

import { Request, Response } from "express";
import Stripe from "stripe";
import { Booking } from "../models/booking";
import axios, { AxiosError } from "axios";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);
const BASE_URL =
    process.env.BASE_URL || "http://localhost:7000";

export const createPaymentIntent = async (req: Request, res: Response) => {
    try {
        const { numberOfNights } = req.body;
        const hotelId = req.headers["x-hotel-id"] as string;

        const response = await axios.get(`${BASE_URL}/api/hotels/${hotelId}`);
        const hotel = response.data;

        if (!hotel) {
            return res.status(400).json({ message: "Hotel Not Found" });
        }

        const totalCost = hotel.pricePerNight * numberOfNights;

        const userId = req.headers["x-user-id"] as string;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalCost * 100), // Convert to cents
            currency: "lkr",
            metadata: {
                hotelId,
                userId: userId!,
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
        const userId = req.headers["x-user-id"] as string;
        const hotelId = req.headers["x-hotel-id"] as string;
        
        const { firstName, lastName, email, adultCount, childCount, checkIn, checkOut, paymentIntentId, totalCost } = req.body;
        const booking = await Booking.create({
            userId,
            hotelId,
            firstName,
            lastName,
            email,
            adultCount,
            childCount,
            checkIn,
            checkOut,
            paymentIntentId,
            totalCost,
        });
        res.status(201).json(booking);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Unable to create booking" });
    }
};

export const getUserBookings = async (req: Request, res: Response) => {
    try {
        const userId = req.headers["x-user-id"] as string;

        const bookings = await Booking.find({ userId });

        // Fetch hotel data for each booking
        const bookingsWithHotels = await Promise.all(
            bookings.map(async (b) => {
                const hotelRes = await axios.get(`${BASE_URL}/api/hotels/${b.hotelId}`);
                return {
                    ...b.toObject(),
                    hotel: hotelRes.data,
                };
            })
        );

        res.status(200).json(bookingsWithHotels);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Unable To Fetch Bookings" });
    }
};