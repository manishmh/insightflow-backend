"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserById = exports.findUserByEmail = void 0;
const user_1 = __importDefault(require("../models/user"));
const findUserByEmail = (email) => {
    try {
        const user = user_1.default.findOne({ email });
        return user;
    }
    catch (error) {
        return null;
    }
};
exports.findUserByEmail = findUserByEmail;
const findUserById = (id) => {
    try {
        const user = user_1.default.findById(id);
        return user;
    }
    catch (error) {
        return null;
    }
};
exports.findUserById = findUserById;
