import { Router, Request, Response, NextFunction } from "express";
import User from "../models/user";
import { tokenAuthorization } from "../middleware/authorization";

const logoutRouter = Router();

logoutRouter.post('/', tokenAuthorization, async (req: Request, res: Response ) => {
    const user = req.user;
    const email = user.email;

    try {
        const updatedUser = await User.updateOne({ email }, { $set: { refreshToken: ''}});

        console.log(updatedUser.modifiedCount);

        if (updatedUser.modifiedCount !== 1) {
            return res.status(404).json({ error: "user not found" });
        }

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return res.status(200).json({ success: "user logged out successfully" })

    } catch (error) {
        console.error('Error removing refreshToken:', error);
        return res.status(500).json({ error: "something went wrong! try again. " }) 
    }
})

export default logoutRouter