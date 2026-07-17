import { Request, Response } from "express";

import prisma from "../prisma.js";

export const getAllWisata = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const wisata = await prisma.tempat_wisata.findMany({
            orderBy: {
                nama_tempat: "asc"
            }
        });

        res.json({
            success: true,
            data: wisata
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const getWisataById = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const id = Number(req.params.id);

        const wisata = await prisma.tempat_wisata.findUnique({
            where: {
                id_tmpt_wst: id
            }
        });

        if (!wisata) {
            res.status(404).json({
                success: false,
                message: "Data tidak ditemukan"
            });
            return;
        }

        res.json({
            success: true,
            data: wisata
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const getWisataByKategori = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const kategori = req.params.kategori as
            "Alam"
            | "Budaya"
            | "Religi"
            | "Edukasi"
            | "Rekreasi";

        const wisata = await prisma.tempat_wisata.findMany({
            where: {
                kategori
            }
        });

        res.json({
            success: true,
            data: wisata
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const createWisata = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const {
            nama_tempat,
            kategori,
            biaya,
            deskripsi,
            gambar
        } = req.body;

        const wisata =
            await prisma.tempat_wisata.create({
                data: {
                    nama_tempat,
                    kategori,
                    biaya,
                    deskripsi,
                    gambar
                }
            });

        res.status(201).json({
            success: true,
            message: "Data berhasil ditambahkan",
            data: wisata
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const updateWisata = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const id = Number(req.params.id);

        const {
            nama_tempat,
            kategori,
            biaya,
            deskripsi,
            gambar
        } = req.body;

        const wisata =
            await prisma.tempat_wisata.update({
                where: {
                    id_tmpt_wst: id
                },

                data: {
                    nama_tempat,
                    kategori,
                    biaya,
                    deskripsi,
                    gambar
                }
            });

        res.json({
            success: true,
            message: "Data berhasil diupdate",
            data: wisata
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const deleteWisata = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const id = Number(req.params.id);

        await prisma.tempat_wisata.delete({
            where: {
                id_tmpt_wst: id
            }
        });

        res.json({
            success: true,
            message: "Data berhasil dihapus"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};