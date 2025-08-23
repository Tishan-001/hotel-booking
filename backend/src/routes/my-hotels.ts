import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
import { HotelType } from "../shared/types";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
    },
});

router.post(
    "/",
    verifyToken,
    [
        body("name").notEmpty().withMessage(`Name Is Required`),
        body("city").notEmpty().withMessage(`City Is Required`),
        body("country").notEmpty().withMessage(`Country Is Required`),
        body("description").notEmpty().withMessage(`Description Is Required`),
        body("type").notEmpty().withMessage(`Hotel Type Is Required`),
        body("pricePerNight")
            .notEmpty()
            .isNumeric()
            .withMessage(`Price Per Night Is Required`),
        body("facilities")
            .notEmpty()
            .isArray()
            .withMessage(`Facilities Are Required`),
    ],
    upload.array("imageFiles", 6),
    async (req: Request, res: Response) => {
        try {
            const imageFiles = req.files as Express.Multer.File[];
            const newHotel: HotelType = req.body;
            const imageURLs = await uploadImages(imageFiles);

            newHotel.imageUrls = imageURLs;
            newHotel.lastUpdated = new Date();
            newHotel.userId = req.userId;

            const hotel = new Hotel(newHotel);

            await hotel.save();

            res.status(201).send(hotel);
        } catch (err) {
            console.log(`Error Creating Hotel: `, err);
            res.status(500).send({ message: `Something Went Wrong!` });
        }
    }
);

router.get("/", verifyToken, async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({ userId: req.userId });

        res.json(hotels);
    } catch {
        res.status(500).json({ message: "Error Fetching Hotels" });
    }
});

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
    const id = req.params.id.toString();

    try {
        const hotel = await Hotel.findOne({
            _id: id,
            userId: req.userId,
        });

        if (!hotel) {
            return res.status(404).send({ message: "Hotel Not Found!" });
        }

        res.json(hotel);
    } catch (err) {
        res.status(500).json({ message: "Error Fetching Hotels" });
    }
});

router.put(
    "/:hotelId",
    verifyToken,
    upload.array("imageFiles"),
    async (req: Request, res: Response) => {
        try {
            const updatedHotel: HotelType = req.body;
            updatedHotel.lastUpdated = new Date();

            const hotel = await Hotel.findOneAndUpdate(
                {
                    _id: req.params.hotelId,
                    userId: req.userId,
                },
                updatedHotel,
                { new: true }
            );

            if (!hotel) {
                return res.status(404).send({ message: "Hotel Not Found!" });
            }

            const files = req.files as Express.Multer.File[];
            const updatedImageUrls = await uploadImages(files);

            hotel.imageUrls = [...(hotel.imageUrls || []), ...updatedImageUrls];

            await hotel.save();

            res.status(201).json(hotel);
        } catch (err) {
            res.status(500).json({ message: "Something Went Wrong" });
        }
    }
);

async function uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (img) => {
        const b64 = Buffer.from(img.buffer).toString("base64");
        let dataURI = "data:" + img.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);

        return res.url;
    });

    const imageURLs = await Promise.all(uploadPromises);
    return imageURLs;
}

export default router;
