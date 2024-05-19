"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const input_validation_schemas_1 = require("../schemas/input-validation-schemas");
const findUser_1 = require("../utils/findUser");
const LoginRouter = (0, express_1.Router)();
LoginRouter.post('/', async (req, res) => {
    try {
        const { email, password, deviceInfo } = req.body;
        const validatedFields = input_validation_schemas_1.loginSchema.safeParse(req.body);
        if (!validatedFields.success) {
            return res.status(400).json({ error: "Invalid Fields" });
        }
        const existingUser = await (0, findUser_1.findUserByEmail)(email);
        if (!existingUser || !existingUser.password || !existingUser.email) {
            return res.status(401).json({ error: "User not found" });
        }
        const isPasswordCorrect = await bcryptjs_1.default.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "wrong credentials" });
        }
        // set device information before checking if the devices already exists and store it into database. 
        const deviceIndex = existingUser.loginDevices.findIndex(device => device.deviceInfo === deviceInfo);
        if (deviceIndex !== -1) {
            existingUser.loginDevices[deviceIndex].lastLogin = new Date();
        }
        else {
            existingUser.loginDevices.push({ deviceInfo, lastLogin: new Date() });
        }
        const accessToken = jsonwebtoken_1.default.sign({ email }, process.env.JWT_ACCESS_SECRET || 'Manish', { expiresIn: '1h' });
        const refreshToken = jsonwebtoken_1.default.sign({ email }, process.env.JWT_REFRESH_SECRET || 'Manish', { expiresIn: '24h' });
        existingUser.refreshToken = refreshToken;
        await existingUser.save();
        // send acces token as cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400000
        });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        res.status(201).json({
            success: "Logged in successfully.",
            refreshToken,
            accessToken,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Something went wrong! Try again. " });
    }
});
exports.default = LoginRouter;
