"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const login_1 = __importDefault(require("./routes/login"));
const register_1 = __importDefault(require("./routes/register"));
const user_dashboard_1 = __importDefault(require("./routes/user-dashboard"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const corsOptions = {
    origin: ['http://localhost:3000', 'https://fsd-frontend-nine.vercel.app'],
    optionsSuccessStatus: 200,
};
// Apply middleware
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// Apply routes
app.use('/register', register_1.default);
app.use('/login', login_1.default);
app.use('/user/dashboard', user_dashboard_1.default);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// Create HTTP server and Initialize Socket.IO
const server = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(server);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
// Start server
const port = process.env.PORT || 8080;
server.listen(port, async () => {
    try {
        // Connect to MongoDB
        await (0, db_1.default)(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        console.log(`Server is running on http://localhost:${port}`);
        // soket io connection after mongodb established connection
        exports.io.on('connection', (socket) => {
            console.log(socket.id + ' connected');
            socket.on('disconnect', () => {
                console.log(socket.id, 'disconnected');
            });
        });
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
});
