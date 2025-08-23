import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";

const router = express.Router();

router.get("/", verifyToken, async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({
            bookings: {
                $elemMatch: {
                    userId: req.userId,
                },
            },
        }); //+ Here We Fetch All Hotel That User Booked

        const result = hotels.map((hotel) => {
            const userBookings = hotel.bookings.filter(
                (booking) => booking.userId === req.userId
            );
            const hotelWithUserBookings: HotelType = {
                ...hotel.toObject(),
                bookings: userBookings,
            };

            return hotelWithUserBookings;
        });
        //+ Here We Get Each Hotel And
        //+ Set It In New Var But The Bookings Will Have The user Booking Only And Will Not Show The Booking Of Others

        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Unable To Fetch Booking" });
    }
});

export default router;
