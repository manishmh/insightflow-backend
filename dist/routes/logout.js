"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("../models/user"));
const authorization_1 = require("../middleware/authorization");
const logoutRouter = (0, express_1.Router)();
logoutRouter.post('/', authorization_1.tokenAuthorization, async (req, res) => {
    const user = req.user;
    const email = user.email;
    try {
        const updatedUser = await user_1.default.updateOne({ email }, { $set: { refreshToken: '' } });
        console.log(updatedUser.modifiedCount);
        if (updatedUser.modifiedCount !== 1) {
            return res.status(404).json({ error: "user not found" });
        }
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return res.status(200).json({ success: "user logged out successfully" });
    }
    catch (error) {
        console.error('Error removing refreshToken:', error);
        return res.status(500).json({ error: "something went wrong! try again. " });
    }
});
exports.default = logoutRouter;
