import bcrypt from 'bcryptjs';
import { Request, Response, Router } from "express";
import jwt from 'jsonwebtoken';
import { loginSchema } from "../schemas/input-validation-schemas";
import { findUserByEmail } from "../utils/findUser";

const LoginRouter = Router();

LoginRouter.post('/', async (req: Request, res: Response) => {
    try {
        const { email, password, deviceInfo } = req.body;
        const validatedFields = loginSchema.safeParse(req.body);

        if (!validatedFields.success) {
            return res.status(400).json({ error: "Invalid Fields" })
        }

        const existingUser = await findUserByEmail(email);

        if (!existingUser || !existingUser.password || !existingUser.email) {
            return res.status(401).json({ error: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)

        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "wrong credentials" });
        }
        
        // set device information before checking if the devices already exists and store it into database. 
        const deviceIndex = existingUser.loginDevices.findIndex(device => device.deviceInfo === deviceInfo);
        if (deviceIndex !== -1) {
            existingUser.loginDevices[deviceIndex].lastLogin = new Date();
        } else {
            existingUser.loginDevices.push({ deviceInfo, lastLogin: new Date() });
        }
        
        
        const accessToken = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET || 'Manish', { expiresIn: '1h' });
        const refreshToken = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET || 'Manish',  { expiresIn: '24h' });
        
        existingUser.refreshToken = refreshToken;
        await existingUser.save();
        
        // send acces token as cookie
        res.cookie('accessToken', accessToken, { 
            // secure: process.env.NODE_ENV === 'production',
            // sameSite: 'strict',
            maxAge: 86400000

        });
        res.cookie('refreshToken', refreshToken, { 
            // secure: process.env.NODE_ENV === 'production',
            // sameSite: 'strict',
            maxAge: 86400000
        });
        res.status(201).json({ 
            success: "Logged in successfully.",
            refreshToken,
            accessToken, 
        }) 
    } catch (error) {
        res.status(500).json({ error: "Something went wrong! Try again. " }) 
    }
});

export default LoginRouter;