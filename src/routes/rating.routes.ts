import { Router } from "express";

import {
    getAllRating,
    getRatingById,
    createRating,
    updateRating,
    deleteRating,
    getRatingSummary,
    getRatingDetail,
    getRatingByWisata
} from "../controllers/rating.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/summary", getRatingSummary);
router.get("/detail/:id", getRatingDetail);

router.get("/", getAllRating);
router.get("/wisata/:id", getRatingByWisata);
router.get("/:id", getRatingById);
router.post("/", createRating);
router.put("/:id", authenticate, updateRating);
router.delete("/:id", authenticate, deleteRating);

export default router;