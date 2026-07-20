import { Request, Response } from "express";

import prisma from "../prisma.js";

export const getAllWisata = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const wisata = await prisma.tempat_wisata.findMany({
            include: {
                rating: true,
            },
            orderBy: {
                nama_tempat: "asc"
            }
        });

        const result = wisata.map((item) => {
            const jumlah_review = item.rating.length;

            const avg_rating =
                jumlah_review === 0
                    ? 0
                    : Number(
                        (
                            item.rating.reduce((total, rating) => {
                                const nilai =
                                    (
                                        rating.wahana +
                                        rating.kebersihan +
                                        rating.spot_foto +
                                        rating.popularitas
                                    ) / 4;
                                return total + nilai;
                            }, 0) / jumlah_review
                        ).toFixed(1)
                    );

            return {
                id_tmpt_wst: item.id_tmpt_wst,
                nama_tempat: item.nama_tempat,
                kategori: item.kategori,
                biaya: item.biaya,
                deskripsi: item.deskripsi,
                gambar: item.gambar,
                avg_rating,
                jumlah_review,
            };
        });

        res.json({
            success: true,
            data: result //sebelumnya "wisata"
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
            include: {
                rating: true,
            },
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

        const jumlah_review = wisata.rating.length;
        const avg_rating =
            jumlah_review === 0
                ? 0
                : wisata.rating.reduce((sum, item) => {
                    const nilai =
                        (
                            item.wahana +
                            item.kebersihan +
                            item.spot_foto +
                            item.popularitas
                        ) / 4;
                    return sum + nilai;
                }, 0) / jumlah_review;

        res.json({
            success: true,
            data: {
                ...wisata,
                avg_rating: Number(avg_rating.toFixed(1)),
                jumlah_review,
            }
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

        // Hapus semua rating yang berhubungan
        await prisma.rating.deleteMany({
            where: {
                id_tmpt_wst: id,
            },
        });

        // Baru hapus tempat wisata
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