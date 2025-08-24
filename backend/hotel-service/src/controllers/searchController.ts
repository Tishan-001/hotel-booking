import { Request, Response } from "express";
import { Hotel } from "../models/hotel";
import { constructSearchQuery } from "../utils/searchQuery";

export const searchHotels = async (req: Request, res: Response) => {
    try {
        const query = constructSearchQuery(req.query);
        let sortOptions = {};

        switch (req.query.sortOption) {
            case "starRating":
                sortOptions = { starRating: -1 };
                break;
            case "pricePerNightAsc":
                sortOptions = { pricePerNight: 1 };
                break;
            case "pricePerNightDesc":
                sortOptions = { pricePerNight: -1 };
                break;
        }

        const pageSize = 5;
        const pageNumber = parseInt(
            req.query.page ? req.query.page.toString() : "1"
        );
        const skip = (pageNumber - 1) * pageSize;

        const hotels = await Hotel.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(pageSize);

        const total = await Hotel.countDocuments(query);

        res.json({
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize),
            },
        });
    } catch (err) {
        console.log("Error", err);
        res.status(500).send({ message: "Something Went Wrong" });
    }
};

export const getAllHotels = async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find().sort("-lastUpdated");
        res.send(hotels);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error Fetching Hotels" });
    }
};

export const getHotelById = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const hotel = await Hotel.findById(id);
        if (!hotel) return res.status(404).json({ message: "Hotel not found" });
        res.json(hotel);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error Fetching Hotel" });
    }
};
