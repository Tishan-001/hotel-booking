import { Booking } from "../models/booking";
import axios from "axios";

export const createBookingSaga = async (bookingData: any) => {
    try {
        // Step 1: Create pending booking
        const booking = new Booking({
            ...bookingData,
            status: "pending",
        });
        await booking.save();

        // Step 2: Verify payment (simplified - in real app, use Stripe webhooks)
        // For demo purposes, we'll assume payment is successful

        // Step 3: Update hotel service about the booking
        try {
            await axios.post(
                `${process.env.HOTEL_SERVICE_URL}/hotels/${bookingData.hotelId}/bookings`,
                {
                    bookingId: booking._id,
                    dates: {
                        checkIn: bookingData.checkIn,
                        checkOut: bookingData.checkOut,
                    },
                }
            );
        } catch (error) {
            // Compensating action: mark booking as cancelled
            await Booking.findByIdAndUpdate(booking._id, {
                status: "cancelled",
            });
            throw new Error("Hotel service update failed");
        }

        // Step 4: Confirm booking
        await Booking.findByIdAndUpdate(booking._id, { status: "confirmed" });

        return booking;
    } catch (error) {
        throw new Error(`Booking creation failed: ${error.message}`);
    }
};
