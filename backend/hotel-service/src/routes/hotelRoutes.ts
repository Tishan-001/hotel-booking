import express from "express";
import {
    searchHotels,
    getAllHotels,
    getHotelById,
} from "../controllers/searchController";

const router = express.Router();

router.get("/search", searchHotels);
router.get("/", getAllHotels);
router.get("/:id", getHotelById);

export default router;
