import { Router } from "express";

import {
    getAllWisata,
    getWisataById,
    getWisataByKategori,
    createWisata,
    updateWisata,
    deleteWisata
} from "../controllers/wisata.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getAllWisata);
router.get("/kategori/:kategori", getWisataByKategori);
router.get("/:id", getWisataById);
router.post("/", authenticate, createWisata);
router.put("/:id", authenticate, updateWisata);
router.delete("/:id", authenticate, deleteWisata);

export default router;