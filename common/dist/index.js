"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserType = exports.updateBlogSchema = exports.createBlogSchemas = exports.signinSchema = exports.signUpSchema = exports.fileSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.fileSchema = zod_1.default.union([
    zod_1.default.string(),
    zod_1.default.object({
        lastModified: zod_1.default.number(),
        name: zod_1.default.string(),
        type: zod_1.default.string(),
        size: zod_1.default.number(),
    }),
]);
exports.signUpSchema = zod_1.default.object({
    name: zod_1.default.string().regex(/^\S*$/), // cheking for space
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6),
});
exports.signinSchema = zod_1.default.object({
    emailOrName: zod_1.default.string(),
    password: zod_1.default.string().min(6),
});
exports.createBlogSchemas = zod_1.default.object({
    title: zod_1.default.string(),
    content: zod_1.default.string(),
    description: zod_1.default.string(),
    published: zod_1.default.boolean(),
    topics: zod_1.default.array(zod_1.default.string()),
    coverImage: exports.fileSchema,
});
exports.updateBlogSchema = zod_1.default.object({
    id: zod_1.default.string(),
    title: zod_1.default.string(),
    content: zod_1.default.string(),
    description: zod_1.default.string(),
    published: zod_1.default.boolean(),
    topics: zod_1.default.array(zod_1.default.string()),
    coverImage: exports.fileSchema,
});
exports.updateUserType = zod_1.default.object({
    name: zod_1.default.string(),
    bio: zod_1.default.string(),
    profileImg: exports.fileSchema,
});
