import { Request, Response } from "express";
import * as UserModel from "../models/user";

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await UserModel.findAll();
        res.status(200).json({
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch users",
        });
    }
};
