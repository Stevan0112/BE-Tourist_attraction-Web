import { Router } from "express";

import {
    getSAW
} from "../controllers/saw.controller.js";

const router = Router();

router.get("/", getSAW);

export default router;