"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const prismaClient_1 = require("../db/prismaClient");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.Authorization;
    if (!token) {
        res.status(401).json({ message: "Sign in first" });
        return;
    }
    try {
        // Verify JWT token
        const decodedPayload = jsonwebtoken_1.default.verify(token, JWT_SECRET || "");
        if (typeof decodedPayload === "string") {
            res.status(403).json({ error: "Error while decoding JWT token" });
            return;
        }
        const userId = decodedPayload.id;
        // Find user and attach to request
        const user = yield prismaClient_1.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        req.user = user;
        next();
    }
    catch (e) {
        console.error(e);
        return res.status(403).json({ error: "Error while user validation" });
    }
});
exports.default = authMiddleware;
