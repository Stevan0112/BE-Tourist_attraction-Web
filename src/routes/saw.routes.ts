import { Router } from "express";

import {
    getSAW,
    getRecommendation
} from "../controllers/saw.controller.js";

const router = Router();

router.get("/", getSAW);
router.get("/recommendation", getRecommendation)

export default router;