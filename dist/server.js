"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const port = 8080;
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    res.send('Hello World! ');
});
app.get('/test', (req, res) => {
    res.send('testtt');
});
app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
});
