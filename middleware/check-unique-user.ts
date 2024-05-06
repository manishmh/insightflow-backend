import { NextFunction, Request, Response } from "express"
import User from "../models/user"

export const checkUniqueUsername = async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.body;

    const existingUser = await User.findOne({ username })
    
    if (existingUser) {
        return res.status(401).json({ error: "username is already taken" });
    }
    
    next();
}
