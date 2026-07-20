import { Request, Response } from "express";
import prisma from "../prisma.js";

import { calculateSAW } from "../services/saw.service.js";

export const getSAW = async (
    req: Request,
    res: Response
): Promise<void> => {
    try{
        const data =
            await calculateSAW();

        res.json({
            success:true,
            data
        });
    }catch(err){
        console.error(err);

        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });
    }
};

export const getRecommendation = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const budget = req.query.budget as string | undefined;
        const kategori = req.query.kategori as string | undefined;
        const rating = req.query.rating as string | undefined;

        const wisata = await prisma.tempat_wisata.findMany({
            include:{
                rating:true
            }
        });

        let data = wisata.map((item) => {
            const avgRating =
                item.rating.length
                    ? item.rating.reduce(
                        (sum, r) =>
                            sum +
                            (
                                r.wahana +
                                r.kebersihan +
                                r.spot_foto +
                                r.popularitas
                            ) / 4,
                        0
                    ) / item.rating.length
                    : 0;
            return {
                ...item,

                avg_rating: Number(
                    avgRating.toFixed(2)
                )
            };
        });

        // Filters
        if (budget) {
            switch (budget) {
                case "<10000":
                    data = data.filter(
                        w => w.biaya < 10000
                    );
                    break;

                case "10000-20000":
                    data = data.filter(
                        w =>
                            w.biaya >= 10000 &&
                            w.biaya <= 20000
                    );
                    break;

                case "20000-50000":
                    data = data.filter(
                        w =>
                            w.biaya >= 20000 &&
                            w.biaya <= 50000
                    );
                    break;

                case ">50000":
                    data = data.filter(
                        w => w.biaya > 50000
                    );
                    break;
            }
        }

        if (kategori) {
            data = data.filter(
                w =>
                w.kategori === kategori
            );
        }

        if (rating) {
            switch (rating) {
                case "<2":
                    data = data.filter(
                        w =>
                            w.avg_rating < 2
                    );
                    break;

                case "2-3":
                    data = data.filter(
                        w =>
                            w.avg_rating >= 2 &&
                            w.avg_rating <= 3
                    );
                    break;

                case "3-4":
                    data = data.filter(
                        w =>
                            w.avg_rating >= 3 &&
                            w.avg_rating <= 4
                    );
                    break;

                case ">4":
                    data = data.filter(
                        w =>
                            w.avg_rating > 4
                    );
                    break;
            }
        }

        // SAW
        if (data.length === 0) {
            res.json({
                success: true,
                data: [],
            });
        }

        // const kriteria = await prisma.kriteria.findMany();
        const maxRating = Math.max(
            ...data.map((w) => w.avg_rating)
        );
        const minBiaya = Math.min(
            ...data.map((w) => w.biaya)
        );

        const hasil = data.map((item) => {
            const biayaNormal =
                minBiaya / item.biaya;

            const ratingNormal =
                item.avg_rating / maxRating;

            const nilaiSaw =
                (biayaNormal * 0.4) +
                (ratingNormal * 0.6);

            return {
                ...item,

                nilai_saw: Number(
                    nilaiSaw.toFixed(4)
                )
            };
        });

        hasil.sort(
            (a, b) =>
                b.nilai_saw -
                a.nilai_saw
        );

        const ranking = hasil.map(
            (item, index) => ({
                ranking: index + 1,
                ...item
            })
        );

        res.json({
            success: true,
            data: ranking,
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};