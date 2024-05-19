"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenAuthorization = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// interface ExtendedRequest extends Request {
//   user?: any;  
// }
const tokenAuthorization = (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken || req.headers['authorization'];
        if (!accessToken) {
            return res.status(401).json({ error: "Unauthorized, no access token" });
        }
        jsonwebtoken_1.default.verify(accessToken, process.env.JWT_ACCESS_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ error: "invalid access token" });
            }
            req.user = user;
        });
        next();
    }
    catch (error) {
        return res.status(403);
    }
};
exports.tokenAuthorization = tokenAuthorization;
