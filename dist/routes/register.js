"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("../models/user"));
const findUser_1 = require("../utils/findUser");
const input_validation_schemas_1 = require("../schemas/input-validation-schemas");
const check_unique_user_1 = require("../middleware/check-unique-user");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const RegisterRouter = (0, express_1.Router)();
RegisterRouter.post('/', check_unique_user_1.checkUniqueUsername, async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const validatedFields = input_validation_schemas_1.registerSchema.safeParse(req.body);
        if (!validatedFields.success) {
            return res.status(400).json({ error: "Invalid input fields." });
        }
        const ExistingUser = await (0, findUser_1.findUserByEmail)(email);
        if (ExistingUser) {
            return res.status(401).json({ error: "Email already registered." });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = new user_1.default({
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();
        return res.status(201).json({ success: "User registered successfully." });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong! try again." });
    }
});
exports.default = RegisterRouter;
