import { Request, Response } from "express";
import prisma from "../prisma.js";

export const getAllKriteria = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const data = await prisma.kriteria.findMany({
            orderBy: {
                id_kriteria: "asc"
            }
        });

        res.json({
            success: true,
            data
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const getKriteriaById = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const id = Number(req.params.id);

        const data = await prisma.kriteria.findUnique({
            where: {
                id_kriteria: id
            }
        });

        if (!data) {
            res.status(404).json({
                success: false,
                message: "Data tidak ditemukan"
            });
            return;
        }

        res.json({
            success: true,
            data
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const createKriteria = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const {
            nama_kriteria,
            atribut,
            bobot
        } = req.body;

        const data = await prisma.kriteria.create({
            data: {
                nama_kriteria,
                atribut,
                bobot
            }
        });

        res.status(201).json({
            success: true,
            message: "Kriteria berhasil ditambahkan",
            data
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const updateKriteria = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const id = Number(req.params.id);

        const {
            nama_kriteria,
            atribut,
            bobot
        } = req.body;

        const data = await prisma.kriteria.update({
            where: {
                id_kriteria: id
            },
            data: {
                nama_kriteria,
                atribut,
                bobot
            }
        });

        res.json({
            success: true,
            message: "Kriteria berhasil diupdate",
            data
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const deleteKriteria = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const id = Number(req.params.id);

        await prisma.kriteria.delete({
            where: {
                id_kriteria: id
            }
        });

        res.json({
            success: true,
            message: "Kriteria berhasil dihapus"
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};