/// <reference path="../types/express.d.ts" />

import { Request, Response } from "express";
import EmailService, { BookingEmailData } from "../services/emailService";
import axios from "axios";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const emailService = new EmailService();
const BASE_URL = process.env.BASE_URL || "http://localhost:7000";

export const sendBookingConfirmation = async (req: Request, res: Response) => {
    try {
        const { booking, userEmail } = req.body;

        if (!booking || !userEmail) {
            return res.status(400).json({ 
                message: "Missing required fields: booking and userEmail" 
            });
        }

        // Fetch hotel details
        const hotelResponse = await axios.get(`${BASE_URL}/api/hotels/${booking.hotelId}`);
        const hotel = hotelResponse.data;

        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        // Prepare email data
        const emailData: BookingEmailData = {
            booking,
            hotel: {
                name: hotel.name,
                city: hotel.city,
                country: hotel.country,
                address: hotel.address
            },
            user: {
                firstName: booking.firstName,
                lastName: booking.lastName,
                email: userEmail
            }
        };

        // Send email
        await emailService.sendBookingConfirmation(emailData);

        res.status(200).json({ 
            message: "Booking confirmation email sent successfully",
            recipient: userEmail
        });

    } catch (error) {
        console.error("Error sending booking confirmation:", error);
        
        if (axios.isAxiosError(error)) {
            return res.status(error.response?.status || 500).json({
                message: "Failed to fetch hotel details",
                error: error.message
            });
        }

        res.status(500).json({ 
            message: "Failed to send booking confirmation email",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

export const testEmailConnection = async (req: Request, res: Response) => {
    try {
        const isConnected = await emailService.testConnection();
        
        if (isConnected) {
            res.status(200).json({ 
                message: "Email service is working correctly",
                status: "connected"
            });
        } else {
            res.status(500).json({ 
                message: "Email service connection failed",
                status: "disconnected"
            });
        }
    } catch (error) {
        res.status(500).json({ 
            message: "Failed to test email connection",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

export const sendTestEmail = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email address is required" });
        }

        // Create test booking data
        const testEmailData: BookingEmailData = {
            booking: {
                _id: "test-booking-123",
                userId: "test-user",
                hotelId: "test-hotel",
                firstName: "Test",
                lastName: "User",
                email: email,
                adultCount: 2,
                childCount: 1,
                checkIn: new Date(),
                checkOut: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                totalCost: 15000
            },
            hotel: {
                name: "Test Hotel",
                city: "Colombo",
                country: "Sri Lanka"
            },
            user: {
                firstName: "Test",
                lastName: "User",
                email: email
            }
        };

        await emailService.sendBookingConfirmation(testEmailData);

        res.status(200).json({ 
            message: "Test email sent successfully",
            recipient: email
        });

    } catch (error) {
        res.status(500).json({ 
            message: "Failed to send test email",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};