import { Router } from "express";

import {
    getAllRating,
    getRatingById,
    createRating,
    updateRating,
    deleteRating
} from "../controllers/rating.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getAllRating);
router.get("/:id", getRatingById);
router.post("/", authenticate, createRating);
router.put("/:id", authenticate, updateRating);
router.delete("/:id", authenticate, deleteRating);

export default router;