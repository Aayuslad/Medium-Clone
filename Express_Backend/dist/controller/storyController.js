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
exports.deleteReply = exports.editReply = exports.getReplyByResponseId = exports.makeReplyToResponse = exports.deleteResponse = exports.editResponse = exports.getResponseByStoryId = exports.makeResponse = exports.followTopic = exports.getTopic = exports.getReadingHistory = exports.getSavedStories = exports.deleteStory = exports.saveStory = exports.clapStory = exports.getStoriesByAuthor = exports.getStoriesByTopics = exports.getAllStories = exports.getStory = exports.upadateStory = exports.createStory = void 0;
const medium_clone_common_1 = require("@aayushlad/medium-clone-common");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient_1 = require("../db/prismaClient");
const cloudinary_1 = require("../utils/cloudinary");
const createStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const body = req.body;
    const coverImg = req.file;
    try {
        body.published = JSON.parse(req.body.published);
        body.topics = req.body.topics.split(",");
        const { success } = medium_clone_common_1.createStorySchema.safeParse(body);
        if (!success) {
            res.status(400);
            return res.json({ message: "Invalid request parameters" });
        }
        // Prepare topic IDs to connect
        let topicIdsToAdd = [];
        if (body.topics && body.topics.length > 0) {
            // Check if topics already exist in the database
            for (const topic of body.topics) {
                if (topic == "")
                    continue;
                const existingTopic = yield prismaClient_1.prisma.topics.findFirst({
                    where: {
                        topic: topic,
                    },
                });
                if (existingTopic) {
                    // If topic already exists, get its ID
                    topicIdsToAdd.push(existingTopic.id);
                }
                else {
                    // If topic doesn't exist, create it and get its ID
                    const newTopic = yield prismaClient_1.prisma.topics.create({
                        data: {
                            topic: topic,
                        },
                    });
                    topicIdsToAdd.push(newTopic.id);
                }
            }
        }
        // Upload cover image to Cloudinary and get secure URL
        const secure_url = coverImg ? yield (0, cloudinary_1.uploadImageCloudinary)(coverImg) : "";
        // Create new story
        const newStory = yield prismaClient_1.prisma.story.create({
            data: {
                title: body.title,
                content: body.content,
                description: body.description,
                postedOn: new Date(),
                published: body.published,
                authorId: (user === null || user === void 0 ? void 0 : user.id) || "",
                coverImg: secure_url,
                topics: {
                    connect: topicIdsToAdd.map((id) => ({ id: id })),
                },
            },
        });
        return res.json({ id: newStory.id });
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error while creating story" });
    }
});
exports.createStory = createStory;
const upadateStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = req.user;
    const body = req.body;
    const coverImg = req.file;
    console.log("update: ", body);
    console.log("coverImg: ", coverImg);
    try {
        body.published = JSON.parse(req.body.published);
        body.topics = req.body.topics.split(",");
        const { success } = medium_clone_common_1.updateStorySchema.safeParse(body);
        if (!success) {
            res.status(400);
            return res.json({ message: "Invalid request parameters" });
        }
        // Prepare topic IDs to connect
        let topicIdsToAdd = [];
        if (body.topics && body.topics.length > 0) {
            // Check if topics already exist in the database
            for (const topic of body.topics) {
                if (topic == "")
                    continue;
                const existingTopic = yield prismaClient_1.prisma.topics.findFirst({
                    where: {
                        topic: topic,
                    },
                });
                if (existingTopic) {
                    // If topic already exists, get its ID
                    topicIdsToAdd.push(existingTopic.id);
                }
                else {
                    // If topic doesn't exist, create it and get its ID
                    const newTopic = yield prismaClient_1.prisma.topics.create({
                        data: {
                            topic: topic,
                        },
                    });
                    topicIdsToAdd.push(newTopic.id);
                }
            }
        }
        // Get the current topics associated with the post
        const currentStory = yield prismaClient_1.prisma.story.findUnique({
            where: {
                id: body.id,
            },
            include: {
                topics: true,
            },
        });
        // Extract topic IDs of the current topics associated with the post
        const currentTopicIds = ((_a = currentStory === null || currentStory === void 0 ? void 0 : currentStory.topics) === null || _a === void 0 ? void 0 : _a.length) && body.published
            ? currentStory.topics.map((topic) => topic.id)
            : [];
        // Find the topic IDs to disconnect
        const topicIdsToDisconnect = currentTopicIds.length > 0 && body.published
            ? currentTopicIds === null || currentTopicIds === void 0 ? void 0 : currentTopicIds.filter((id) => !topicIdsToAdd.includes(id))
            : [];
        // add new image link if added else set old url
        const existingPost = yield prismaClient_1.prisma.story.findUnique({
            where: {
                id: body.id,
            },
        });
        const currentCoverImage = existingPost === null || existingPost === void 0 ? void 0 : existingPost.coverImg;
        const secure_url = coverImg
            ? yield (0, cloudinary_1.uploadImageCloudinary)(coverImg, currentCoverImage)
            : currentCoverImage;
        // updating the story
        yield prismaClient_1.prisma.story.update({
            where: {
                id: body.id,
                authorId: user === null || user === void 0 ? void 0 : user.id,
            },
            data: {
                title: body.title,
                content: body.content,
                description: body.description,
                published: body.published,
                postedOn: new Date(),
                coverImg: secure_url,
                topics: {
                    connect: topicIdsToAdd.length > 0 ? topicIdsToAdd.map((id) => ({ id: id })) : [], // Connect post with existing or newly created topics
                    disconnect: topicIdsToDisconnect.length > 0 ? topicIdsToDisconnect.map((id) => ({ id: id })) : [], // Disconnect post from topics that are no longer associated
                },
            },
        });
        // Updating topics count
        if (topicIdsToAdd) {
            yield prismaClient_1.prisma.topics.updateMany({
                where: {
                    id: {
                        in: topicIdsToAdd,
                    },
                },
                data: {
                    storiesCount: {
                        increment: 1,
                    },
                },
            });
        }
        if (topicIdsToDisconnect) {
            yield prismaClient_1.prisma.topics.updateMany({
                where: {
                    id: {
                        in: topicIdsToAdd,
                    },
                },
                data: {
                    storiesCount: {
                        decrement: 1,
                    },
                },
            });
        }
        // updating stories count in topics if published
        if (body.published) {
            yield prismaClient_1.prisma.topics.updateMany({
                where: {
                    id: {
                        in: topicIdsToAdd,
                    },
                },
                data: {
                    storiesCount: {
                        increment: 1,
                    },
                },
            });
        }
        return res.json({ message: "story updated" });
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error while updating story" });
    }
});
exports.upadateStory = upadateStory;
const getStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const id = req.params.id;
    const token = (_b = req.cookies) === null || _b === void 0 ? void 0 : _b.Authorization;
    try {
        // finding story
        const story = yield prismaClient_1.prisma.story.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                title: true,
                content: true,
                description: true,
                postedOn: true,
                clapsCount: true,
                responseCount: true,
                published: true,
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
                        followersCount: true,
                    },
                },
            },
        });
        const transformedStory = Object.assign(Object.assign({}, story), { topics: story === null || story === void 0 ? void 0 : story.topics.map((topicObj) => topicObj.topic) });
        res.json(transformedStory);
        // Update reading history
        if (token) {
            const decodedToken = jsonwebtoken_1.default.decode(token);
            const existingReadingHistory = yield prismaClient_1.prisma.readingHistory.findFirst({
                where: {
                    userId: decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id,
                    storyId: id,
                },
            });
            // if (existingReadingHistory) {
            // 	await prisma.readingHistory.update({
            // 		where: {
            // 			id: existingReadingHistory.id,
            // 		},
            // 		data: {
            // 			readAt: new Date(),
            // 		},
            // 	});
            // 	console.log("Story already exists in reading history");
            // } else {
            // 	await prisma.readingHistory.create({
            // 		data: {
            // 			storyId: id,
            // 			userId: decodedToken?.id as string,
            // 		},
            // 	});
            // }
        }
        return;
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error while fetching story data" });
    }
});
exports.getStory = getStory;
const getAllStories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
    try {
        const stories = yield prismaClient_1.prisma.story.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            where: {
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
                        profileImg: true,
                    },
                },
            },
        });
        // Map over stories to transform topics to an array of strings
        const transformedStries = stories.map((story) => (Object.assign(Object.assign({}, story), { topics: story.topics.map((topicObj) => topicObj.topic) })));
        return res.json(transformedStries);
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error while fetching story data" });
    }
});
exports.getAllStories = getAllStories;
const getStoriesByTopics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topics = req.params.topics;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    try {
        const stories = yield prismaClient_1.prisma.story.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            where: {
                published: true,
                topics: {
                    some: {
                        topic: {
                            in: topics.split(","),
                        },
                    },
                },
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
                        profileImg: true,
                    },
                },
            },
        });
        // Map over stories to transform topics to an array of strings
        const transformedStories = {
            topic: topics,
            stories: stories.map((story) => (Object.assign(Object.assign({}, story), { topics: story.topics.map((topicObj) => topicObj.topic) }))),
        };
        return res.json(transformedStories);
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error while fetching story data" });
    }
});
exports.getStoriesByTopics = getStoriesByTopics;
const getStoriesByAuthor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
    try {
        const followdAuthors = yield prismaClient_1.prisma.user.findFirst({
            where: {
                id: user === null || user === void 0 ? void 0 : user.id,
            },
            select: {
                following: {
                    select: {
                        followingId: true,
                    },
                },
            },
        });
        const stories = yield prismaClient_1.prisma.story.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            where: {
                published: true,
                author: {
                    id: {
                        in: followdAuthors === null || followdAuthors === void 0 ? void 0 : followdAuthors.following.map((author) => author.followingId),
                    },
                },
            },
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
                coverImg: true,
                author: {
                    select: {
                        id: true,
                        userName: true,
                        profileImg: true,
                    },
                },
            },
        });
        // Map over stories to transform topics to an array of strings
        const transformedStories = {
            topic: "Following",
            stories: stories.map((story) => (Object.assign(Object.assign({}, story), { topics: story.topics.map((topicObj) => topicObj.topic) }))),
        };
        return res.json(transformedStories);
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error while fetching story data" });
    }
});
exports.getStoriesByAuthor = getStoriesByAuthor;
const clapStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const body = req.body;
    try {
        const { success } = medium_clone_common_1.clapStorySchema.safeParse(body);
        if (!success) {
            res.status(400);
            return res.json({ message: "Invalid request parameters" });
        }
        // If the user has already clapped, delete the existing clap record
        const existingClap = yield prismaClient_1.prisma.clap.findFirst({
            where: {
                userId: user === null || user === void 0 ? void 0 : user.id,
                storyId: body.storyId,
            },
        });
        if (existingClap) {
            yield prismaClient_1.prisma.clap.delete({
                where: {
                    id: existingClap.id,
                },
            });
            yield prismaClient_1.prisma.story.update({
                where: {
                    id: body.storyId,
                },
                data: {
                    clapsCount: {
                        decrement: 1,
                    },
                },
            });
            return res.json({ message: "Clap removed." });
        }
        // creating new clap record
        yield prismaClient_1.prisma.clap.create({
            data: {
                userId: user === null || user === void 0 ? void 0 : user.id,
                storyId: body.storyId,
            },
        });
        yield prismaClient_1.prisma.story.update({
            where: {
                id: body.storyId,
            },
            data: {
                clapsCount: {
                    increment: 1,
                },
            },
        });
        return res.json({ message: "story claped" });
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error claping" });
    }
});
exports.clapStory = clapStory;
const saveStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const body = req.body;
    try {
        const { success } = medium_clone_common_1.clapStorySchema.safeParse(body);
        if (!success) {
            res.status(400);
            return res.json({ message: "Invalid request parameters" });
        }
        // If the user has saved, delete the existing saved record
        const existingSave = yield prismaClient_1.prisma.savedStory.findFirst({
            where: {
                userId: user === null || user === void 0 ? void 0 : user.id,
                storyId: body.storyId,
            },
        });
        if (existingSave) {
            yield prismaClient_1.prisma.savedStory.delete({
                where: {
                    id: existingSave.id,
                },
            });
            return res.json({ message: "story unsaved" });
        }
        // creating new save record
        yield prismaClient_1.prisma.savedStory.create({
            data: {
                userId: user === null || user === void 0 ? void 0 : user.id,
                storyId: body.storyId,
            },
        });
        return res.json({ message: "story saved" });
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error saving story" });
    }
});
exports.saveStory = saveStory;
const deleteStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const id = req.params.id;
    try {
        // Find and delete any related SavedStory records
        yield prismaClient_1.prisma.savedStory.deleteMany({
            where: {
                storyId: id,
            },
        });
        // deleting delete
        yield prismaClient_1.prisma.story.delete({
            where: {
                id: id,
                authorId: user === null || user === void 0 ? void 0 : user.id,
            },
        });
        res.status(201);
        return res.json({ message: "story deleted" });
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error deleting story" });
    }
});
exports.deleteStory = deleteStory;
// get svaed stories
const getSavedStories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        const savedStoryIds = yield prismaClient_1.prisma.savedStory.findMany({
            where: {
                userId: user === null || user === void 0 ? void 0 : user.id,
            },
            select: {
                storyId: true,
            },
        });
        const stories = yield prismaClient_1.prisma.story.findMany({
            where: {
                id: {
                    in: savedStoryIds.map((savedStory) => savedStory.storyId),
                },
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
                        profileImg: true,
                    },
                },
            },
        });
        // Map over stories to transform topics to an array of strings
        const transformedStries = stories.map((story) => (Object.assign(Object.assign({}, story), { topics: story.topics.map((topicObj) => topicObj.topic) })));
        return res.json(transformedStries);
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error fetching saved stories" });
    }
});
exports.getSavedStories = getSavedStories;
// get reading history
const getReadingHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        const readingHistoryIds = yield prismaClient_1.prisma.readingHistory.findMany({
            where: {
                userId: user === null || user === void 0 ? void 0 : user.id,
            },
            orderBy: {
                readAt: "desc",
            },
            select: {
                storyId: true,
            },
        });
        if (!readingHistoryIds.length) {
            return res.json([]);
        }
        const stories = yield prismaClient_1.prisma.story.findMany({
            where: {
                id: {
                    in: readingHistoryIds.map((readingHistory) => readingHistory.storyId),
                },
                published: true,
            },
            orderBy: {
                id: "desc",
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
                        profileImg: true,
                    },
                },
            },
        });
        // Map over stories to transform topics to an array of strings
        const transformedStries = stories.map((story) => (Object.assign(Object.assign({}, story), { topics: story.topics.map((topicObj) => topicObj.topic) })));
        return res.json(transformedStries);
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error fetching reading history" });
    }
});
exports.getReadingHistory = getReadingHistory;
const getTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topicName = req.params.topic;
    try {
        const topic = yield prismaClient_1.prisma.topics.findFirst({
            where: {
                topic: topicName,
            },
        });
        if (!topic) {
            res.status(400);
            return res.json({ message: "Topic not found" });
        }
        return res.json(topic);
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error fetching topic data" });
    }
});
exports.getTopic = getTopic;
const followTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const body = req.body;
    try {
        const { success } = medium_clone_common_1.followTopicSchema.safeParse(body);
        if (!success) {
            res.status(400);
            return res.json({ message: "Invalid request parameters" });
        }
        // if user alredy follows, then unfollow
        const existingFollow = yield prismaClient_1.prisma.followedTopic.findFirst({
            where: {
                userId: user === null || user === void 0 ? void 0 : user.id,
                topicId: body.topicId,
            },
        });
        if (existingFollow) {
            yield prismaClient_1.prisma.followedTopic.delete({
                where: {
                    id: existingFollow.id,
                },
            });
            yield prismaClient_1.prisma.topics.update({
                where: {
                    id: body.topicId,
                },
                data: {
                    followersCount: {
                        decrement: 1,
                    },
                },
            });
            return res.json({ message: "topic unfollowed" });
        }
        // creating new follow record
        yield prismaClient_1.prisma.followedTopic.create({
            data: {
                userId: user === null || user === void 0 ? void 0 : user.id,
                topicId: body.topicId,
            },
        });
        yield prismaClient_1.prisma.topics.update({
            where: {
                id: body.topicId,
            },
            data: {
                followersCount: {
                    increment: 1,
                },
            },
        });
        return res.json({ message: "topic followed" });
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error following topic" });
    }
});
exports.followTopic = followTopic;
// make a response
const makeResponse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const body = req.body;
    try {
        const { success } = medium_clone_common_1.makeResponseSchema.safeParse(body);
        if (!success) {
            res.status(400);
            return res.json({ message: "Invalid request parameters" });
        }
        // creating new response record
        const response = yield prismaClient_1.prisma.response.create({
            data: {
                content: body.content,
                storyId: body.storyId,
                userId: user === null || user === void 0 ? void 0 : user.id,
            },
        });
        const newResponse = yield prismaClient_1.prisma.response.findFirst({
            where: {
                id: response.id,
            },
            select: {
                id: true,
                content: true,
                postedAt: true,
                replyCount: true,
                user: {
                    select: {
                        id: true,
                        userName: true,
                        profileImg: true,
                    },
                },
            },
        });
        res.json(newResponse);
        // updating responseCount in story
        yield prismaClient_1.prisma.story.update({
            where: {
                id: body.storyId,
            },
            data: {
                responseCount: {
                    increment: 1,
                },
            },
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error making response" });
    }
});
exports.makeResponse = makeResponse;
// get responses by story id
const getResponseByStoryId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const storyId = req.params.storyId;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 6;
    try {
        const responses = yield prismaClient_1.prisma.response.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            where: {
                storyId: storyId,
            },
            orderBy: {
                postedAt: "desc",
            },
            select: {
                id: true,
                content: true,
                postedAt: true,
                replyCount: true,
                user: {
                    select: {
                        id: true,
                        userName: true,
                        profileImg: true,
                    },
                },
            },
        });
        return res.json(responses);
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error fetching response" });
    }
});
exports.getResponseByStoryId = getResponseByStoryId;
// edit a response
const editResponse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const body = req.body;
    try {
        const { success } = medium_clone_common_1.editResponseSchema.safeParse(body);
        if (!success) {
            res.status(400);
            return res.json({ message: "Invalid request parameters" });
        }
        // updating response
        const response = yield prismaClient_1.prisma.response.update({
            where: {
                id: body.responseId,
                userId: user === null || user === void 0 ? void 0 : user.id,
            },
            data: {
                content: body.content,
            },
        });
        const updatedResponse = yield prismaClient_1.prisma.response.findFirst({
            where: {
                id: response.id,
            },
            select: {
                id: true,
                content: true,
                postedAt: true,
                replyCount: true,
                user: {
                    select: {
                        id: true,
                        userName: true,
                        profileImg: true,
                    },
                },
            },
        });
        return res.json(updatedResponse);
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error editing response" });
    }
});
exports.editResponse = editResponse;
// delete a response
const deleteResponse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const responseId = req.params.responseId;
    try {
        // deleting subresponses
        yield prismaClient_1.prisma.subResponse.deleteMany({
            where: {
                responseId: responseId,
            },
        });
        // deleting the response
        const response = yield prismaClient_1.prisma.response.delete({
            where: {
                id: responseId,
                userId: user === null || user === void 0 ? void 0 : user.id,
            },
        });
        res.status(204).json({ message: "response deleted" });
        // updating responseCount in story
        yield prismaClient_1.prisma.story.update({
            where: {
                id: response.storyId,
            },
            data: {
                responseCount: {
                    decrement: 1,
                },
            },
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error deleting response" });
    }
});
exports.deleteResponse = deleteResponse;
// make a reply to subresponse
const makeReplyToResponse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const body = req.body;
    try {
        const { success } = medium_clone_common_1.makeReplyToResponseSchema.safeParse(body);
        if (!success) {
            res.status(400);
            return res.json({ message: "Invalid request parameters" });
        }
        // creating new subresponse record
        const reply = yield prismaClient_1.prisma.subResponse.create({
            data: {
                content: body.content,
                responseId: body.responseId,
                userId: user === null || user === void 0 ? void 0 : user.id,
            },
        });
        const newRelay = yield prismaClient_1.prisma.subResponse.findFirst({
            where: {
                id: reply.id,
            },
            select: {
                id: true,
                content: true,
                postedAt: true,
                user: {
                    select: {
                        id: true,
                        userName: true,
                        profileImg: true,
                    },
                },
            },
        });
        res.json(newRelay);
        // incrementing replycount in response
        yield prismaClient_1.prisma.response.update({
            where: {
                id: body.responseId,
            },
            data: {
                replyCount: {
                    increment: 1,
                },
            },
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error making response" });
    }
});
exports.makeReplyToResponse = makeReplyToResponse;
// get reply by response id
const getReplyByResponseId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const responseId = req.params.responseId;
    const page = parseInt(req.query.page) || 1;
    const pageSize = 4;
    try {
        const replies = yield prismaClient_1.prisma.subResponse.findMany({
            where: {
                responseId: responseId,
            },
            orderBy: {
                postedAt: "asc",
            },
            take: pageSize,
            skip: (page - 1) * pageSize,
            select: {
                id: true,
                content: true,
                postedAt: true,
                user: {
                    select: {
                        id: true,
                        userName: true,
                        profileImg: true,
                    },
                },
            },
        });
        return res.json(replies);
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error fetching reply" });
    }
});
exports.getReplyByResponseId = getReplyByResponseId;
// edit a reply to response
const editReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const body = req.body;
    try {
        const { success } = medium_clone_common_1.editReplySchema.safeParse(body);
        if (!success) {
            res.status(400);
            return res.json({ message: "Invalid request parameters" });
        }
        // creating new subresponse record
        const reply = yield prismaClient_1.prisma.subResponse.update({
            where: {
                id: body.responseId,
                userId: user === null || user === void 0 ? void 0 : user.id,
            },
            data: {
                content: body.content,
            },
        });
        const updatedReply = yield prismaClient_1.prisma.subResponse.findFirst({
            where: {
                id: reply.id,
            },
            select: {
                id: true,
                content: true,
                postedAt: true,
                user: {
                    select: {
                        id: true,
                        userName: true,
                        profileImg: true,
                    },
                },
            },
        });
        return res.json(updatedReply);
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error editing reply" });
    }
});
exports.editReply = editReply;
// dekete a response
const deleteReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const replyId = req.params.replyId;
    try {
        // deleting the response
        const response = yield prismaClient_1.prisma.subResponse.delete({
            where: {
                id: replyId,
                userId: user === null || user === void 0 ? void 0 : user.id,
            },
        });
        res.status(204).json({ message: "reply deleted" });
        // updating replyCount in reply
        yield prismaClient_1.prisma.response.update({
            where: {
                id: response.responseId,
            },
            data: {
                replyCount: {
                    decrement: 1,
                },
            },
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error deleting reply" });
    }
});
exports.deleteReply = deleteReply;
