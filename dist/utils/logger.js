"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const chalk_1 = __importDefault(require("chalk"));
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.printf(({ level, message, timestamp }) => {
        const color = level === 'error' ? chalk_1.default.red :
            level === 'warn' ? chalk_1.default.yellow :
                chalk_1.default.white;
        return `${timestamp} [${color(level.toUpperCase())}] ${message}`;
    })),
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({ filename: 'combined.log' })
    ]
});
exports.default = logger;
