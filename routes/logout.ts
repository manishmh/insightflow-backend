import { Router, Request, Response, NextFunction } from "express";
import User from "../models/user";
import { tokenAuthorization } from "../middleware/authorization";

const logoutRouter = Router();

logoutRouter.post('/', tokenAuthorization, async (req: Request, res: Response ) => {
    const cookie = req.cookies;
    const refreshToken = cookie.refreshToken;
    
    if (!refreshToken) {
        return res.status(401).json({ error: "no refresh token" })
    }

    try {
        const updatedUser = await User.updateOne({ refreshToken }, { $set: { refreshToken: ''}});

        console.log(updatedUser.modifiedCount);

        if (updatedUser.modifiedCount !== 1) {
            return res.status(404).json({ error: "user not found" });
        }

        res.cookie('accessToken', '', { maxAge: 0, httpOnly: true });
        res.clearCookie('refreshToken', { httpOnly: true });
        return res.status(200).json({ success: "user logged out successfully" })

    } catch (error) {
        console.error('Error removing refreshToken:', error);
        return res.status(500).json({ message: "something went wrong! try again. " }) 
    }
})

export default logoutRouter