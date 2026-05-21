import { Request, Response } from "express";
import { userService } from "./user.service";

const getMe = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized!" });
        }
        const result = await userService.getMe(user.id);
        res.status(200).json(result);
    } catch (e) {
        res.status(400).json({
            error: "Failed to fetch user",
            details: e
        });
    }
};

export const UserController = {
    getMe
};
