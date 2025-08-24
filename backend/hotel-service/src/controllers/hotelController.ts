import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { Hotel } from "../models/hotel";
import { uploadImages } from "../utils/cloudinary";

export const createHotel = [
    body("name").notEmpty().withMessage("Name Is Required"),
    body("city").notEmpty().withMessage("City Is Required"),
    body("country").notEmpty().withMessage("Country Is Required"),
    body("description").notEmpty().withMessage("Description Is Required"),
    body("type").notEmpty().withMessage("Hotel Type Is Required"),
    body("pricePerNight")
        .notEmpty()
        .isNumeric()
        .withMessage("Price Per Night Is Required"),
    body("facilities")
        .notEmpty()
        .isArray()
        .withMessage("Facilities Are Required"),

    async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const imageFiles = req.files as Express.Multer.File[];
            const newHotel = req.body;
            const imageURLs = await uploadImages(imageFiles);

            newHotel.imageUrls = imageURLs;
            newHotel.lastUpdated = new Date();
            newHotel.userId = req.userId;

            const hotel = new Hotel(newHotel);
            await hotel.save();

            res.status(201).send(hotel);
        } catch (err) {
            console.log("Error Creating Hotel: ", err);
            res.status(500).send({ message: "Something Went Wrong!" });
        }
    },
];

export const getMyHotels = async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({ userId: req.userId });
        res.json(hotels);
    } catch {
        res.status(500).json({ message: "Error Fetching Hotels" });
    }
};

export const getMyHotel = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const hotel = await Hotel.findOne({ _id: id, userId: req.userId });
        if (!hotel)
            return res.status(404).send({ message: "Hotel Not Found!" });
        res.json(hotel);
    } catch (err) {
        res.status(500).json({ message: "Error Fetching Hotel" });
    }
};

export const updateMyHotel = async (req: Request, res: Response) => {
    try {
        const updatedHotel = req.body;
        updatedHotel.lastUpdated = new Date();

        const hotel = await Hotel.findOneAndUpdate(
            { _id: req.params.hotelId, userId: req.userId },
            updatedHotel,
            { new: true }
        );

        if (!hotel)
            return res.status(404).send({ message: "Hotel Not Found!" });

        const files = req.files as Express.Multer.File[];
        if (files && files.length > 0) {
            const updatedImageUrls = await uploadImages(files);
            hotel.imageUrls = [...(hotel.imageUrls || []), ...updatedImageUrls];
            await hotel.save();
        }

        res.status(201).json(hotel);
    } catch (err) {
        res.status(500).json({ message: "Something Went Wrong" });
    }
};
