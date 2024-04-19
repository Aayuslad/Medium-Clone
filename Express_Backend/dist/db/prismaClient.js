"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const extension_accelerate_1 = require("@prisma/extension-accelerate");
exports.prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL || "",
        },
    },
}).$extends((0, extension_accelerate_1.withAccelerate)());
