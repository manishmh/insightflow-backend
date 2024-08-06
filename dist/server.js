"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./src/app"));
dotenv_1.default.config();
const corsOptions = {
    origin: ['http://localhost:3000'],
    credentials: true,
};
app_1.default.use((0, cookie_parser_1.default)());
app_1.default.use((0, cors_1.default)(corsOptions));
app_1.default.use(express_1.default.json());
app_1.default.get('/', (req, res) => {
    res.send('Insigh Flow Home route!');
});
const server = http_1.default.createServer(app_1.default);
// Error handling middlewares
app_1.default.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
const port = process.env.PORT || 8080;
server.listen(port, async () => {
    try {
        console.log(`Server is running on http://localhost:${port}`);
    }
    catch (error) {
        process.exit(1);
    }
});
exports.default = app_1.default;
