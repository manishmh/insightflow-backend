"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDeviceWatcher = void 0;
const user_1 = __importDefault(require("../models/user"));
const UserDeviceWatcher = async (socketIO) => {
    user_1.default.watch().on("change", async (change) => {
        const devices = await user_1.default.find({})
            .select("loginDevices")
            .exec()
            .catch((err) => {
            console.error(err);
        });
        socketIO.emit('userLoggedIn', {});
    });
};
exports.UserDeviceWatcher = UserDeviceWatcher;
