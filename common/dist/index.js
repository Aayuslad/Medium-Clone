"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogSchema = exports.createBlogSchemas = exports.signinSchema = exports.signUpSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signUpSchema = zod_1.default.object({
    name: zod_1.default.string().regex(/^\S*$/, "Name should not contain spaces"),
    email: zod_1.default.string().email("Invalid email"),
    password: zod_1.default.string().min(6, "Password must be at least 6 chars"),
});
exports.signinSchema = zod_1.default.object({
    emailOrName: zod_1.default.string(),
    password: zod_1.default.string().min(6, "Password must be at least 6 chars"),
});
exports.createBlogSchemas = zod_1.default.object({
    title: zod_1.default.string(),
    content: zod_1.default.string(),
    description: zod_1.default.string(),
    published: zod_1.default.boolean(),
    topics: zod_1.default.array(zod_1.default.string()),
});
exports.updateBlogSchema = zod_1.default.object({
    id: zod_1.default.string(),
    title: zod_1.default.string(),
    content: zod_1.default.string(),
    description: zod_1.default.string(),
    published: zod_1.default.boolean(),
    topics: zod_1.default.array(zod_1.default.string()),
});
