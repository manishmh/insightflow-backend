import { Request, Response, Router } from "express";
import User from "../models/user";
import { tokenAuthorization } from "../middleware/authorization";
import { io } from "../server";

const userDashboardRouter = Router();

userDashboardRouter.get('/', tokenAuthorization, async (req: Request, res: Response) => {
    try {
        const email = req.user.email;
        const user = await User.findOne({ email  })

        if (!user) {
            res.status(403).json({ error: "unauthorized" })
        } else io.emit('userLoggedIn', user.loginDevices)

        res.status(201).json({ success: "device data fetched."})
    } catch (error) {
        res.status(500).json({ error: "something went wrong"})
    }
})

userDashboardRouter.post('/', tokenAuthorization, async (req: Request, res: Response) => {
    try {
        const email = req.user.email;
        console.log('device-name', req.body)
        const { deviceName } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        const newDevice = user.loginDevices.filter(device => device.deviceInfo !== deviceName);
        user.loginDevices = newDevice;

        await user.save();

        io.emit('userLoggedIn', newDevice);

        res.status(200).json({ success: "Device removed successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }

})

export default userDashboardRouter