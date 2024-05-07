"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUniqueUsername = void 0;
const user_1 = __importDefault(require("../models/user"));
const checkUniqueUsername = async (req, res, next) => {
    const { username } = req.body;
    const existingUser = await user_1.default.findOne({ username });
    if (existingUser) {
        return res.status(401).json({ error: "username is already taken" });
    }
    next();
};
exports.checkUniqueUsername = checkUniqueUsername;
