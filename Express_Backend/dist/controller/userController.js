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
exports.followUser = exports.updateUserAboutSection = exports.updateUser = exports.getUserProfile = exports.getUser = exports.signOutUser = exports.signInUser = exports.signUpUser = void 0;
const medium_clone_common_1 = require("@aayushlad/medium-clone-common");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = __importDefault(require("zod"));
// import { CustomRequest } from "../middleware/authMiddleware";
const cloudinary_1 = require("../utils/cloudinary");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
const signUpUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        // parsing request body
        const { success } = medium_clone_common_1.signUpSchema.safeParse(body);
        if (!success) {
            res.status(400);
            return res.json({ message: "Invalid request parameters" });
        }
        // cheking for reapiting email
        const repeatEmail = yield prisma.user.findUnique({
            where: {
                email: body.email,
            },
        });
        if (repeatEmail) {
            res.status(400);
            return res.json({ message: "User alredy exist with this email" });
        }
        // hashing password
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(body.password, salt);
        // creating user
        const user = yield prisma.user.create({
            data: {
                email: body.email,
                password: hash,
                userName: body.name,
            },
        });
        // sign jwt token and setting in cookies
        const token = jsonwebtoken_1.default.sign({ id: user.id }, String(JWT_SECRET));
        res.cookie("Authorization", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        return res.json({ message: "Signged up" });
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error while signing up" });
    }
});
exports.signUpUser = signUpUser;
const signInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        // parsing request body
        const { success } = medium_clone_common_1.signinSchema.safeParse(body);
        if (!success) {
            res.status(400);
            return res.json({ message: "Invalid request parameters" });
        }
        // find user
        const user = yield prisma.user.findFirst({
            where: {
                OR: [
                    {
                        email: body.emailOrName,
                    },
                    {
                        userName: body.emailOrName,
                    },
                ],
            },
        });
        if (!user) {
            res.status(400);
            return res.json({ message: "User does not exist" });
        }
        // cheking for password
        const result = yield bcrypt_1.default.compare(body.password, user.password);
        if (!result) {
            res.status(401);
            return res.json({ message: "Incorrect password" });
        }
        // sign jwt token and setting in cookies
        const token = jsonwebtoken_1.default.sign({ id: user.id }, String(JWT_SECRET));
        res.cookie("Authorization", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        return res.json({ message: "Signged in" });
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error while signing in" });
    }
});
exports.signInUser = signInUser;
const signOutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // removing authorization token
        res.clearCookie("Authorization", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        return res.json({ message: "Signed out" });
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error while signing out" });
    }
});
exports.signOutUser = signOutUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const user = req.user;
    try {
        // find user
        const userData = yield prisma.user.findUnique({
            where: {
                id: user === null || user === void 0 ? void 0 : user.id,
            },
            select: {
                id: true,
                userName: true,
                email: true,
                bio: true,
                about: true,
                profileImg: true,
            },
        });
        if (!userData) {
            res.status(404);
            return res.json({ message: "User not found" });
        }
        return res.json(userData);
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error while fetching user data" });
    }
});
exports.getUser = getUser;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const user = yield prisma.user.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                userName: true,
                email: true,
                bio: true,
                about: true,
                profileImg: true,
                followers: true, // improvement here
                following: true, // improvement here
                stories: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        postedOn: true,
                        topics: {
                            select: {
                                topic: true,
                            },
                        },
                        coverImage: true,
                        author: {
                            select: {
                                id: true,
                                userName: true,
                                bio: true,
                                email: true,
                                profileImg: true,
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            res.status(404);
            return res.json({ error: "User do not exist!" });
        }
        const transformedUser = Object.assign(Object.assign({}, user), { posts: user === null || user === void 0 ? void 0 : user.stories.map((story) => (Object.assign(Object.assign({}, story), { topics: story.topics.map((topic) => topic.topic) }))) });
        return res.json(transformedUser);
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error while fetching user data" });
    }
});
exports.getUserProfile = getUserProfile;
// multer work remaining
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const user = req.user;
    const body = req.body;
    const profileImg = req.file;
    try {
        const { success } = medium_clone_common_1.updateUserSchema.safeParse(body);
        if (!success) {
            res.status(400);
            return res.json({ error: "Invalid request parameters" });
        }
        // Check if the name has been changed and if, Check for new name already exists in the database
        if (body.name !== (user === null || user === void 0 ? void 0 : user.userName)) {
            const existingUser = yield prisma.user.findUnique({
                where: {
                    userName: body.name,
                },
            });
            if (existingUser) {
                return res.json({ error: "User alredy exist" });
            }
        }
        // add new image link if added else set old url
        const existingPost = yield prisma.user.findUnique({
            where: {
                id: user === null || user === void 0 ? void 0 : user.id,
            },
            select: {
                profileImg: true,
            },
        });
        const currentProfileImg = existingPost === null || existingPost === void 0 ? void 0 : existingPost.profileImg;
        //@ts-ignore
        const secure_url = profileImg ? yield (0, cloudinary_1.uploadImageCloudinary)(profileImg) : currentProfileImg;
        // update post
        yield prisma.user.update({
            where: {
                id: user === null || user === void 0 ? void 0 : user.id,
            },
            data: {
                userName: body.name,
                bio: body.bio,
                profileImg: secure_url,
            },
        });
        return res.json({ message: "User updated" });
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error while updating user data" });
    }
});
exports.updateUser = updateUser;
const updateUserAboutSection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const user = req.user;
    const body = req.body;
    try {
        // parse body
        const { success } = medium_clone_common_1.updateUserAboutSchema.safeParse(body);
        if (!success) {
            res.status(400);
            return res.json({ error: "Invalid request parameters" });
        }
        // update post
        yield prisma.user.update({
            where: {
                id: user === null || user === void 0 ? void 0 : user.id,
            },
            data: {
                about: body.about,
            },
        });
        return res.json({ message: "User updated" });
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error while updating user data" });
    }
});
exports.updateUserAboutSection = updateUserAboutSection;
const followUserSchema = zod_1.default.object({
    userToFollow: zod_1.default.string(),
});
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const user = req.user;
    const body = req.body;
    try {
        // parse body
        const { success } = followUserSchema.safeParse(body);
        if (!success) {
            res.status(400);
            return res.json({ error: "Invalid request parameters" });
        }
        // Retrieve the user to follow
        const userToFollow = yield prisma.user.findFirst({
            where: {
                id: body.userToFollow,
            },
        });
        if (!userToFollow) {
            res.status(400);
            return res.json({ error: "user does not exist" });
        }
        // Check if the user is already following the specified user
        const existingFollow = yield prisma.follow.findFirst({
            where: {
                followerId: user === null || user === void 0 ? void 0 : user.id,
                followingId: body.userToFollow,
            },
        });
        // If already following, unfollow the user
        if (existingFollow) {
            yield prisma.follow.delete({
                where: {
                    id: existingFollow.id,
                },
            });
            // Decrement the follower count for the user being unfollowed
            yield prisma.user.update({
                where: { id: body.userToFollow },
                data: { followersCount: { decrement: 1 } },
            });
            // Decrement the following count for the current user
            yield prisma.user.update({
                where: { id: user === null || user === void 0 ? void 0 : user.id },
                data: { followingCount: { decrement: 1 } },
            });
            return res.json({ message: "User unfollowed successfully" });
        }
        // If not already following, create a new follow relationship
        yield prisma.follow.create({
            data: {
                followerId: user === null || user === void 0 ? void 0 : user.id,
                followingId: body.userToFollow,
            },
        });
        // Increment the follower count for the user being followed
        yield prisma.user.update({
            where: { id: body.userToFollow },
            data: { followersCount: { increment: 1 } },
        });
        // Increment the following count for the current user
        yield prisma.user.update({
            where: { id: user === null || user === void 0 ? void 0 : user.id },
            data: { followingCount: { increment: 1 } },
        });
        return res.json({ message: "User followed successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error while updating user" });
    }
});
exports.followUser = followUser;
