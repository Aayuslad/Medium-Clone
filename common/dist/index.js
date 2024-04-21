"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.followTopicSchema = exports.clapStorySchema = exports.updateStorySchema = exports.createStorySchema = exports.followUserSchema = exports.updateUserAboutSectionSchema = exports.updateUserSchema = exports.signinUserSchema = exports.signUpUserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
//
exports.signUpUserSchema = zod_1.default.object({
    userName: zod_1.default.string().regex(/^\S*$/),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6),
});
//
exports.signinUserSchema = zod_1.default.object({
    emailOrName: zod_1.default.string(),
    password: zod_1.default.string().min(6),
});
//
exports.updateUserSchema = zod_1.default.object({
    userName: zod_1.default.string().regex(/^\S*$/),
    bio: zod_1.default.string(),
});
//
exports.updateUserAboutSectionSchema = zod_1.default.object({
    about: zod_1.default.string(),
});
//
exports.followUserSchema = zod_1.default.object({
    userIdToFollow: zod_1.default.string(),
});
//
exports.createStorySchema = zod_1.default.object({
    title: zod_1.default.string(),
    content: zod_1.default.string(),
    description: zod_1.default.string(),
    published: zod_1.default.boolean(),
    topics: zod_1.default.array(zod_1.default.string()),
});
//
exports.updateStorySchema = exports.createStorySchema.merge(zod_1.default.object({
    id: zod_1.default.string(),
}));
//
exports.clapStorySchema = zod_1.default.object({
    storyId: zod_1.default.string(),
});
//
exports.followTopicSchema = zod_1.default.object({
    topicId: zod_1.default.string(),
});
