"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("../models/user"));
const authorization_1 = require("../middleware/authorization");
const server_1 = require("../server");
const userDashboardRouter = (0, express_1.Router)();
userDashboardRouter.get('/', authorization_1.tokenAuthorization, async (req, res) => {
    try {
        const email = req.user.email;
        const user = await user_1.default.findOne({ email });
        if (!user) {
            res.status(403).json({ error: "unauthorized" });
        }
        else
            server_1.io.emit('userLoggedIn', user.loginDevices);
        res.status(201).json({ success: "device data fetched." });
    }
    catch (error) {
        res.status(500).json({ error: "something went wrong" });
    }
});
userDashboardRouter.put('/', authorization_1.tokenAuthorization, async (req, res) => {
    try {
        const email = req.user.email;
        console.log('device-name', req.body);
        const { deviceName } = req.body;
        const user = await user_1.default.findOne({ email });
        if (!user) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        const newDevice = user.loginDevices.filter(device => device.deviceInfo !== deviceName);
        user.loginDevices = newDevice;
        await user.save();
        server_1.io.emit('userLoggedIn', newDevice);
        res.status(200).json({ message: "Device removed successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.default = userDashboardRouter;
