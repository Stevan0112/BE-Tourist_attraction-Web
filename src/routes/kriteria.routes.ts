import { Router } from "express";

import {
    getAllKriteria,
    getKriteriaById,
    createKriteria,
    updateKriteria,
    deleteKriteria
} from "../controllers/kriteria.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getAllKriteria);
router.get("/:id", getKriteriaById);
router.post("/", authenticate, createKriteria);
router.put("/:id", authenticate, updateKriteria);
router.delete("/:id", authenticate, deleteKriteria);

export default router;