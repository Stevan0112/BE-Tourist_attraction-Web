import { Request, Response } from "express";
import prisma from "../prisma.js";

export const getAllRating = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const rating = await prisma.rating.findMany({
            include: {
                tempat_wisata: true
            },
            orderBy: {
                date: "desc"
            }
        });

        res.json({
            success: true,
            data: rating
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const getRatingById = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const id = Number(req.params.id);

        const rating = await prisma.rating.findUnique({
            where: {
                rating_id: id
            },
            include: {
                tempat_wisata: true
            }
        });

        if (!rating) {
            res.status(404).json({
                success: false,
                message: "Data tidak ditemukan"
            });
            return;
        }

        res.json({
            success: true,
            data: rating
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const createRating = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const {
            id_tmpt_wst,
            wahana,
            kebersihan,
            spot_foto,
            popularitas,
            review,
            nama_penilai
        } = req.body;

        const rating = await prisma.rating.create({
            data: {
                date: new Date(),
                id_tmpt_wst,
                wahana,
                kebersihan,
                spot_foto,
                popularitas,
                review,
                nama_penilai
            }
        });

        res.status(201).json({
            success: true,
            message: "Rating berhasil ditambahkan",
            data: rating
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const updateRating = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const id = Number(req.params.id);

        const {
            id_tmpt_wst,
            wahana,
            kebersihan,
            spot_foto,
            popularitas,
            review,
            nama_penilai
        } = req.body;

        const rating = await prisma.rating.update({
            where: {
                rating_id: id
            },
            data: {
                id_tmpt_wst,
                wahana,
                kebersihan,
                spot_foto,
                popularitas,
                review,
                nama_penilai
            }
        });

        res.json({
            success: true,
            message: "Rating berhasil diupdate",
            data: rating
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const deleteRating = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const id = Number(req.params.id);

        await prisma.rating.delete({
            where: {
                rating_id: id
            }
        });

        res.json({
            success: true,
            message: "Rating berhasil dihapus"
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// new summary & detail controller
export const getRatingSummary = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const summary = await prisma.rating.groupBy({
            by: ["id_tmpt_wst"],

            _count: {
                rating_id: true,
            },

            _avg: {
                wahana: true,
                kebersihan: true,
                spot_foto: true,
                popularitas: true,
            },
        });

        const wisata = await prisma.tempat_wisata.findMany();

        const result = summary.map((item) => {
            const tempat = wisata.find(
                (w) => w.id_tmpt_wst === item.id_tmpt_wst
            );

            const avg =
                (
                    Number(item._avg.wahana ?? 0) +
                    Number(item._avg.kebersihan ?? 0) +
                    Number(item._avg.spot_foto ?? 0) +
                    Number(item._avg.popularitas ?? 0)
                ) / 4;

            return {
                id_tmpt_wst: item.id_tmpt_wst,
                nama_tempat: tempat?.nama_tempat,
                jumlah_review: item._count.rating_id,
                avg_rating: Number(avg.toFixed(1)),
            };
        });

        res.json({
            success: true,
            data: result,
        });
    } catch (err) {
        console.error("ERROR SUMMARY");
        console.error(err);

        res.status(500).json({
            success: false,
            error: err,
        });
    }
};

export const getRatingDetail = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const id = Number(req.params.id);

        const data = await prisma.rating.findMany({

            where: {
                id_tmpt_wst: id,
            },

            orderBy: {
                date: "desc",
            },
        });

        res.json({
            success: true,
            data,
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
        });
    }
};