import { Request, Response } from "express";
import bcrypt from "bcrypt";

import prisma from "../prisma.js";
import { generateToken } from "../lib/jwt.js";

export const register = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password) {
            res.status(400).json({
                success: false,
                message: "Username dan password wajib diisi",
            });
            return;
        }

        const exist = await prisma.users.findUnique({
            where: {
                username,
            },
        });

        if (exist) {
            res.status(400).json({
                success: false,
                message: "Username sudah digunakan",
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.users.create({
            data: {
                username,
                password: hashedPassword,
                role: role ?? "admin",
            },
        });

        res.status(201).json({
            success: true,
            message: "Register berhasil",
            data: {
                user_id: user.user_id,
                username: user.username,
            },
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const login = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { username, password } = req.body;

        const user = await prisma.users.findUnique({
            where: {
                username,
            },
        });

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User tidak ditemukan",
            });
            return;
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: "Password salah",
            });
            return;
        }

        const token = generateToken(
            user.user_id,
            user.username,
            user.role
        );

        res.json({
            success: true,
            message: "Login berhasil",
            data: {
                token,
                user: {
                    user_id: user.user_id,
                    username: user.username,
                    role: user.role,
                },
            },
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};