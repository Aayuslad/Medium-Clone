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
exports.getUserRecomendations = exports.globalSearch = exports.getRandomTopics = exports.getRandomAuthors = exports.getUserMutedAuthors = exports.getUserFollowingAuthors = exports.muteAuthor = exports.followUser = exports.updateUserAboutSection = exports.updateUser = exports.getUserStories = exports.getUserProfile = exports.getUser = exports.signOutUser = exports.signInUser = exports.signUpUser = void 0;
const medium_clone_common_1 = require("@aayushlad/medium-clone-common");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient_1 = require("../db/prismaClient");
const cloudinary_1 = require("../utils/cloudinary");
const JWT_SECRET = process.env.JWT_SECRET;
const signUpUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        // parsing request body
        const { success } = medium_clone_common_1.signUpUserSchema.safeParse(body);
        if (!success) {
            res.status(400);
            return res.json({ message: "Invalid request parameters" });
        }
        // cheking token of cloudflare turnstyle
        const formData = new FormData();
        formData.append("secret", process.env.ReCAPTCHA_SECRET_KEY);
        formData.append("response", body.token);
        const result = yield fetch("https://www.google.com/recaptcha/api/siteverify", {
            body: formData,
            method: "POST",
        });
        const isChalangeSuccess = (yield result.json()).success;
        if (!isChalangeSuccess)
            return res.status(400).json({ message: "Invalid captcha" });
        // check for repitative email and username
        const repeatEmail = yield prismaClient_1.prisma.user.findUnique({
            where: {
                email: body.email,
            },
        });
        if (repeatEmail) {
            res.status(400);
            return res.json({ message: "User alredy exist with this email" });
        }
        const repeatUsername = yield prismaClient_1.prisma.user.findUnique({
            where: {
                userName: body.userName,
            },
        });
        if (repeatUsername) {
            res.status(400);
            return res.json({ message: "User alredy exist with this username" });
        }
        // hashing password
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(body.password, salt);
        // creating user
        const user = yield prismaClient_1.prisma.user.create({
            data: {
                email: body.email,
                password: hash,
                userName: body.userName,
            },
        });
        // signing jwt token and setting in cookies
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
        const { success } = medium_clone_common_1.signinUserSchema.safeParse(body);
        if (!success) {
            res.status(400);
            return res.json({ message: "Invalid request parameters" });
        }
        // cheking token of cloudflare turnstyle
        const formData = new FormData();
        formData.append("secret", process.env.ReCAPTCHA_SECRET_KEY);
        formData.append("response", body.token);
        const result = yield fetch("https://www.google.com/recaptcha/api/siteverify", {
            body: formData,
            method: "POST",
        });
        const isChalangeSuccess = (yield result.json()).success;
        if (!isChalangeSuccess) {
            res.status(400);
            return res.json({ message: "Invalid captcha" });
        }
        // find user
        const user = yield prismaClient_1.prisma.user.findFirst({
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
        // cheking password
        const passwordresult = yield bcrypt_1.default.compare(body.password, user.password);
        if (!passwordresult) {
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
    const user = req.user;
    try {
        // find user
        const userData = yield prismaClient_1.prisma.user.findUnique({
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
                followedTopics: {
                    select: {
                        topic: true,
                    },
                },
                savedStories: {
                    select: {
                        storyId: true,
                    },
                },
                claps: {
                    select: {
                        storyId: true,
                    },
                },
                following: {
                    select: {
                        followingId: true,
                    },
                },
                mutedAuthors: {
                    select: {
                        authorId: true,
                    },
                },
            },
        });
        if (!userData) {
            res.status(404);
            return res.json({ message: "User not found" });
        }
        const transformedUser = Object.assign(Object.assign({}, userData), { savedStories: userData === null || userData === void 0 ? void 0 : userData.savedStories.map((story) => story.storyId), claps: userData.claps.map((clap) => clap.storyId), following: userData.following.map((user) => user.followingId), followedTopics: userData.followedTopics.map((topic) => ({
                topic: topic.topic.topic,
                id: topic.topic.id,
            })), mutedAuthors: userData.mutedAuthors.map((author) => author.authorId) });
        return res.json(transformedUser);
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
        const user = yield prismaClient_1.prisma.user.findUnique({
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
                followersCount: true,
                followingCount: true,
                following: {
                    select: {
                        followingId: true,
                    },
                    take: 5,
                },
            },
        });
        if (!user) {
            res.status(404);
            return res.json({ error: "User do not exist!" });
        }
        // function that fetches user data
        function fetchUser(id) {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield prismaClient_1.prisma.user.findUnique({
                    where: {
                        id: id,
                    },
                    select: {
                        id: true,
                        profileImg: true,
                        userName: true,
                        bio: true,
                    },
                });
                return res;
            });
        }
        const transformedUser = Object.assign(Object.assign({}, user), { topFiveFollowing: yield Promise.all(user.following.map((following) => __awaiter(void 0, void 0, void 0, function* () { return yield fetchUser(following.followingId); }))), following: "" });
        return res.json(transformedUser);
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error while fetching user data" });
    }
});
exports.getUserProfile = getUserProfile;
const getUserStories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
    try {
        const stories = yield prismaClient_1.prisma.story.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            where: {
                authorId: id,
                published: true,
            },
            select: {
                id: true,
                title: true,
                description: true,
                postedOn: true,
                clapsCount: true,
                responseCount: true,
                topics: {
                    select: {
                        topic: true,
                    },
                },
                coverImg: true,
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
        });
        const modifiedStories = stories.map((story) => (Object.assign(Object.assign({}, story), { topics: story.topics.map((topic) => topic.topic) })));
        return res.json(modifiedStories);
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error while fetching user data" });
    }
});
exports.getUserStories = getUserStories;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const body = req.body;
    const profileImg = req.file;
    console.log(body);
    try {
        const { success } = medium_clone_common_1.updateUserSchema.safeParse(body);
        if (!success) {
            res.status(400);
            return res.json({ error: "Invalid request parameters" });
        }
        // Check if the name has been changed and if, Check for new name already exists in the database
        if (body.userName !== (user === null || user === void 0 ? void 0 : user.userName)) {
            const existingUser = yield prismaClient_1.prisma.user.findUnique({
                where: {
                    userName: body.userName,
                },
            });
            if (existingUser) {
                return res.json({ error: "User alredy exist" });
            }
        }
        // add new image link if added else set old url
        const oldProfile = yield prismaClient_1.prisma.user.findUnique({
            where: {
                id: user === null || user === void 0 ? void 0 : user.id,
            },
            select: {
                profileImg: true,
            },
        });
        const currentProfileImg = oldProfile === null || oldProfile === void 0 ? void 0 : oldProfile.profileImg;
        const secure_url = profileImg
            ? yield (0, cloudinary_1.uploadImageCloudinary)(profileImg, currentProfileImg)
            : currentProfileImg;
        // update story
        yield prismaClient_1.prisma.user.update({
            where: {
                id: user === null || user === void 0 ? void 0 : user.id,
            },
            data: {
                userName: body.userName,
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
    const user = req.user;
    const body = req.body;
    try {
        // parse body
        const { success } = medium_clone_common_1.updateUserAboutSectionSchema.safeParse(body);
        if (!success) {
            res.status(400);
            return res.json({ error: "Invalid request parameters" });
        }
        // update post
        yield prismaClient_1.prisma.user.update({
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
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const body = req.body;
    try {
        const { success } = medium_clone_common_1.followUserSchema.safeParse(body);
        if (!success) {
            res.status(400);
            return res.json({ error: "Invalid request parameters" });
        }
        // Retrieve the user to follow
        const userToFollow = yield prismaClient_1.prisma.user.findFirst({
            where: {
                id: body.userIdToFollow,
            },
        });
        if (!userToFollow) {
            res.status(400);
            return res.json({ error: "user does not exist" });
        }
        // Check if the user is already following the specified user
        const existingFollow = yield prismaClient_1.prisma.follow.findFirst({
            where: {
                followerId: user === null || user === void 0 ? void 0 : user.id,
                followingId: body.userIdToFollow,
            },
        });
        // If already following, unfollow the user
        if (existingFollow) {
            yield prismaClient_1.prisma.follow.delete({
                where: {
                    id: existingFollow.id,
                },
            });
            // Decrement the follower count for the user being unfollowed
            yield prismaClient_1.prisma.user.update({
                where: { id: body.userIdToFollow },
                data: { followersCount: { decrement: 1 } },
            });
            // Decrement the following count for the current user
            yield prismaClient_1.prisma.user.update({
                where: { id: user === null || user === void 0 ? void 0 : user.id },
                data: { followingCount: { decrement: 1 } },
            });
            return res.json({ message: "User unfollowed successfully" });
        }
        // If not already following, create a new follow relationship
        yield prismaClient_1.prisma.follow.create({
            data: {
                followerId: user === null || user === void 0 ? void 0 : user.id,
                followingId: body.userIdToFollow,
            },
        });
        // Increment the follower count for the user being followed
        yield prismaClient_1.prisma.user.update({
            where: { id: body.userIdToFollow },
            data: { followersCount: { increment: 1 } },
        });
        // Increment the following count for the current user
        yield prismaClient_1.prisma.user.update({
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
// mute an author for user
const muteAuthor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const authorId = req.params.authorId;
    try {
        const existingMutedAuthor = yield prismaClient_1.prisma.mutedAuthors.findFirst({
            where: {
                userId: user === null || user === void 0 ? void 0 : user.id,
                authorId: authorId,
            },
        });
        if (existingMutedAuthor) {
            yield prismaClient_1.prisma.mutedAuthors.delete({
                where: {
                    id: existingMutedAuthor.id,
                },
            });
            return res.json({ message: "Author unmuted successfully" });
        }
        else {
            yield prismaClient_1.prisma.mutedAuthors.create({
                data: {
                    userId: (user === null || user === void 0 ? void 0 : user.id) || "",
                    authorId: authorId,
                },
            });
            return res.json({ message: "Author muted successfully" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error while muting author" });
    }
});
exports.muteAuthor = muteAuthor;
// get user following authors
const getUserFollowingAuthors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 12;
    try {
        const followingAuthors = yield prismaClient_1.prisma.follow.findMany({
            take: pageSize,
            skip: (page - 1) * pageSize,
            where: {
                followerId: user === null || user === void 0 ? void 0 : user.id,
            },
            select: {
                following: {
                    select: {
                        id: true,
                        userName: true,
                        profileImg: true,
                        bio: true,
                        followersCount: true,
                    },
                },
            },
        });
        const modifiedData = followingAuthors.map((author) => author.following);
        return res.json(modifiedData);
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error while getting user following authors" });
    }
});
exports.getUserFollowingAuthors = getUserFollowingAuthors;
// get user muted authors
const getUserMutedAuthors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 12;
    try {
        const mutedAuthors = yield prismaClient_1.prisma.mutedAuthors.findMany({
            take: pageSize,
            skip: (page - 1) * pageSize,
            where: {
                userId: user === null || user === void 0 ? void 0 : user.id,
            },
            select: {
                author: {
                    select: {
                        id: true,
                        userName: true,
                        profileImg: true,
                        bio: true,
                        followersCount: true,
                    },
                },
            },
        });
        const modifiedData = mutedAuthors.map((author) => author.author);
        return res.json(modifiedData);
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error while getting user muted authors" });
    }
});
exports.getUserMutedAuthors = getUserMutedAuthors;
// get random authors
const getRandomAuthors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 12;
    try {
        const randomAuthors = yield prismaClient_1.prisma.user.findMany({
            take: pageSize,
            skip: (page - 1) * pageSize,
            select: {
                id: true,
                bio: true,
                userName: true,
                profileImg: true,
                followersCount: true,
            },
        });
        return res.json(randomAuthors);
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error getting random authors" });
    }
});
exports.getRandomAuthors = getRandomAuthors;
// get random topics
const getRandomTopics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 12;
    try {
        const topics = yield prismaClient_1.prisma.topics.findMany({
            take: pageSize,
            skip: (page - 1) * pageSize,
            select: {
                id: true,
                topic: true,
                followersCount: true,
                storiesCount: true,
            },
        });
        return res.json(topics);
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error while getting user muted authors" });
    }
});
exports.getRandomTopics = getRandomTopics;
// global search route
const globalSearch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.query;
    try {
        const [storiesStartsWith, authorsStartsWith, topicsStartsWith] = yield prismaClient_1.prisma.$transaction([
            prismaClient_1.prisma.story.findMany({
                take: 3,
                where: {
                    title: {
                        startsWith: query,
                        mode: "insensitive",
                    },
                },
                select: {
                    id: true,
                    title: true,
                },
            }),
            prismaClient_1.prisma.user.findMany({
                take: 3,
                where: {
                    userName: {
                        startsWith: query,
                        mode: "insensitive",
                    },
                },
                select: {
                    id: true,
                    userName: true,
                    profileImg: true,
                },
            }),
            prismaClient_1.prisma.topics.findMany({
                take: 3,
                where: {
                    topic: {
                        startsWith: query,
                        mode: "insensitive",
                    },
                },
                select: {
                    topic: true,
                },
            }),
        ]);
        const storiesCount = storiesStartsWith.length;
        const authorsCount = authorsStartsWith.length;
        const topicsCount = topicsStartsWith.length;
        const additionalStories = storiesCount < 3
            ? yield prismaClient_1.prisma.story.findMany({
                take: 3 - storiesCount,
                where: {
                    title: {
                        contains: query,
                        mode: "insensitive",
                    },
                    NOT: {
                        id: {
                            in: storiesStartsWith.map((story) => story.id),
                        },
                    },
                },
                select: {
                    id: true,
                    title: true,
                },
            })
            : [];
        const additionalAuthors = authorsCount < 3
            ? yield prismaClient_1.prisma.user.findMany({
                take: 3 - authorsCount,
                where: {
                    userName: {
                        contains: query,
                        mode: "insensitive",
                    },
                    NOT: {
                        id: {
                            in: authorsStartsWith.map((author) => author.id),
                        },
                    },
                },
                select: {
                    id: true,
                    userName: true,
                    profileImg: true,
                },
            })
            : [];
        const additionalTopics = topicsCount < 3
            ? yield prismaClient_1.prisma.topics.findMany({
                take: 3 - topicsCount,
                where: {
                    topic: {
                        contains: query,
                        mode: "insensitive",
                    },
                    NOT: {
                        topic: {
                            in: topicsStartsWith.map((topic) => topic.topic),
                        },
                    },
                },
                select: {
                    topic: true,
                },
            })
            : [];
        const stories = [...storiesStartsWith, ...additionalStories];
        const authors = [...authorsStartsWith, ...additionalAuthors];
        const topics = [...topicsStartsWith, ...additionalTopics];
        return res.json({
            stories,
            authors,
            topics,
        });
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error while getting search results" });
    }
});
exports.globalSearch = globalSearch;
// get right container data
const getUserRecomendations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.userId;
    try {
        const recommendedTopics = yield prismaClient_1.prisma.topics.findMany({
            take: 7,
            select: {
                topic: true,
            },
        });
        const whoToFollow = yield prismaClient_1.prisma.user.findMany({
            take: 3,
            select: {
                id: true,
                userName: true,
                profileImg: true,
                bio: true,
            },
        });
        const recentlySaved = userId
            ? yield prismaClient_1.prisma.savedStory.findMany({
                take: 4,
                where: {
                    userId: userId,
                },
                select: {
                    story: {
                        select: {
                            id: true,
                            title: true,
                            author: {
                                select: {
                                    userName: true,
                                    profileImg: true,
                                },
                            },
                        },
                    },
                },
            })
            : [];
        const modifiedRecentlySaved = recentlySaved.map((story) => {
            return {
                id: story.story.id,
                title: story.story.title,
                author: story.story.author.userName,
                authorProfileImg: story.story.author.profileImg,
            };
        });
        return res.json({ recommendedTopics, whoToFollow, recentlySaved: modifiedRecentlySaved });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUserRecomendations = getUserRecomendations;
