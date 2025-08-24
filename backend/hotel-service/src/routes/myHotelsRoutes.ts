import express from "express";
import {
    createHotel,
    getMyHotels,
    getMyHotel,
    updateMyHotel,
} from "../controllers/hotelController";
import { upload } from "../middleware/upload";

const router = express.Router();

router.post("/", upload.array("imageFiles", 6), createHotel);
router.get("/", getMyHotels);
router.get("/:id", getMyHotel);
router.put("/:hotelId", upload.array("imageFiles"), updateMyHotel);

export default router;
