import { Request, Response } from "express";

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