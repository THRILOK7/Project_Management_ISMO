"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    else if (req.cookies?.token) {
        token = req.cookies.token;
    }
    if (!token) {
        res.status(401).json({ error: 'Not authorized, no token' });
        return;
    }
    try {
        // JWT is cryptographically verified — no DB lookup needed on every request.
        // The token already contains the user's id and email, which is all we need
        // to authorize downstream queries that are scoped to userId anyway.
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = { id: decoded.id, email: decoded.email || '' };
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Not authorized, token failed' });
        return;
    }
};
exports.protect = protect;
