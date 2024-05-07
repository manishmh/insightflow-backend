import { Request, Response, Router } from "express";
import { loginSchema } from "../schemas/input-validation-schemas";
import bcrypt from 'bcryptjs'
import { findUserByEmail } from "../utils/findUser";
import jwt from 'jsonwebtoken';
import { io } from "../server";

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
            return res.status(401).json({ error: "incorrect password" });
        }
        
        // set device information before checking if the devices already exists and store it into database. 
        const deviceIndex = existingUser.loginDevices.findIndex(device => device.deviceInfo === deviceInfo);
        if (deviceIndex !== -1) {
            existingUser.loginDevices[deviceIndex].lastLogin = new Date();
        } else {
            existingUser.loginDevices.push({ deviceInfo, lastLogin: new Date() });
        }
        
        
        const accessToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY || 'Manish', { expiresIn: '1h' });
        const refreshToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY || 'Manish',  { expiresIn: '24h' });
        
        existingUser.refreshToken = refreshToken;
        await existingUser.save();
        
        io.emit('userLoggedIn', existingUser.loginDevices)

        // send acces token as cookie
        res.cookie('accessToken', accessToken, { httpOnly: true });
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