import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import { BookingType, HotelSearchResponse } from "../shared/types";
import { param, validationResult } from "express-validator";
import Stripe from "stripe";
import verifyToken from "../middleware/auth";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);
const router = express.Router();

router.get("/search", async (req: Request, res: Response) => {
    try {
        const query = constructSearchQuery(req.query);

        let sortOptions = {};
        switch (req.query.sortOption) {
            case "starRating":
                sortOptions = { starRating: -1 }; //+ From Top To Low Sorting
                break;
            case "pricePerNightAsc":
                sortOptions = { pricePerNight: 1 }; //+ From Low To Top Sorting
                break;
            case "pricePerNightDesc":
                sortOptions = { pricePerNight: -1 };
                break;
        }

        const pageSize = 5; //+ How Much Hotels Will Appeared In The Page
        const pageNumber = parseInt(
            req.query.page ? req.query.page.toString() : "1"
        );
        const skip = (pageNumber - 1) * pageSize;

        const hotels = await Hotel.find(query) //+ To Filter The Results
            .sort(sortOptions) //+ Sort Depend On The Options
            .skip(skip) //+ Let Us  Skip The Hotel In Last Pages
            .limit(pageSize); //+ To Get Only 5 Hotel Per Page
        const total = await Hotel.countDocuments(query); //+ It Return How Much Hotel Did We Have
        const response: HotelSearchResponse = {
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize),
            },
        };

        res.json(response);
    } catch (err) {
        console.log(`Error`, err);
        res.status(500).send({ message: "Something Went Wrong" });
    }
});

router.get("/", async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find().sort("-lastUpdate");

        res.send(hotels);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error Fetching Hotels" });
    }
});

router.get(
    "/:id",
    [param("id").notEmpty().withMessage("Hotel ID is required")],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id.toString();
        try {
            const hotel = await Hotel.findById(id);

            res.json(hotel);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Error Fetching Hotel" });
        }
    }
);

router.post(
    "/:hotelId/bookings/payment-intent",
    verifyToken,
    async (req: Request, res: Response) => {
        const { numberOfNights } = req.body;
        const hotelId = req.params.hotelId;

        const hotel = await Hotel.findById(hotelId);

        if (!hotel) {
            return res.status(400).json({ message: "Hotel Not Found" });
        }

        const totalCost = hotel.pricePerNight * numberOfNights;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalCost,
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

        const response = {
            paymentIntentId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret.toString(),
            totalCost,
        };

        res.send(response);
    }
);

router.post(
    "/:hotelId/bookings",
    verifyToken,
    async (req: Request, res: Response) => {
        try {
            const paymentIntentId = req.body.paymentIntentId;

            const paymentIntent = await stripe.paymentIntents.retrieve(
                paymentIntentId as string
            );

            if (!paymentIntent) {
                return res
                    .status(400)
                    .json({ message: "Payment Intent Not Found" });
            }

            if (
                paymentIntent.metadata.hotelId !== req.params.hotelId ||
                paymentIntent.metadata.userId !== req.userId
            ) {
                return res
                    .status(400)
                    .json({ message: "Payment Intent Mismatch" });
            }

            if (paymentIntent.status !== "succeeded") {
                return res.status(400).json({
                    message: `Payment Intent Not Succeeded. Status: ${paymentIntent.status}`,
                });
            }

            const newBooking: BookingType = {
                ...req.body,
                userId: req.userId,
            };

            const hotel = await Hotel.findByIdAndUpdate(
                {
                    _id: req.params.hotelId,
                },
                {
                    $push: { bookings: newBooking },
                }
            );

            if (!hotel) {
                return res.status(400).json({ message: "Hotel Not Found" });
            }

            await hotel.save();
            res.status(200).send();
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something Went Wrong" });
        }
    }
);

const constructSearchQuery = (queryParams: any) => {
    //+ The queryParams Will Store The MongoDB Query.
    let constructedQuery: any = {};

    if (queryParams.destination) {
        constructedQuery.$or = [
            //+ $or Used To Match City Field Or Country Field
            { city: new RegExp(queryParams.destination, "i") },
            { country: new RegExp(queryParams.destination, "i") },
        ];
    }

    if (queryParams.adultCount) {
        constructedQuery.adultCount = {
            $gte: parseInt(queryParams.adultCount), //+ $gte result >= value
        };
    }

    if (queryParams.childCount) {
        constructedQuery.childCount = {
            $gte: parseInt(queryParams.childCount),
        };
    }

    if (queryParams.facilities) {
        constructedQuery.facilities = {
            $all: Array.isArray(queryParams.facilities)
                ? queryParams.facilities //+ Strings
                : [queryParams.facilities], //+ Array Of Strings
        };
    }

    if (queryParams.types) {
        constructedQuery.type = {
            $in: Array.isArray(queryParams.types)
                ? queryParams.types
                : [queryParams.types],
        };
    }

    if (queryParams.stars) {
        const starRatings = Array.isArray(queryParams.stars)
            ? queryParams.stars.map((star: string) => parseInt(star))
            : parseInt(queryParams.stars);
        constructedQuery.starRating = { $in: starRatings }; //+ $eq Used To Match Equal Value
    }

    if (queryParams.maxPrice) {
        constructedQuery.pricePerNight = {
            $lte: parseInt(queryParams.maxPrice).toString(), //+ $lte Used To result <= value
        };
    }

    return constructedQuery;
};

export default router;
