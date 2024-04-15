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
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveStory = exports.clapStory = exports.deleteStory = exports.upadateStory = exports.createStory = exports.getAllStories = exports.getStory = void 0;
const client_1 = require("@prisma/client");
// import { CustomRequest } from "../middleware/authMiddleware";
const cloudinary_1 = require("../utils/cloudinary");
const medium_clone_common_1 = require("@aayushlad/medium-clone-common");
const prisma = new client_1.PrismaClient();
const getStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        // finding story
        const story = yield prisma.story.findUnique({
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
                savedBy: {
                    select: {
                        userId: true,
                    },
                },
                claps: {
                    select: {
                        userId: true,
                    },
                },
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
        });
        // function that fetches user data
        function fetchUser(id) {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield prisma.user.findUnique({
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
        const transformedStory = Object.assign(Object.assign({}, story), { topics: story === null || story === void 0 ? void 0 : story.topics.map((topicObj) => topicObj.topic), claps: (story === null || story === void 0 ? void 0 : story.claps) &&
                (yield Promise.all(story === null || story === void 0 ? void 0 : story.claps.map((clap) => __awaiter(void 0, void 0, void 0, function* () { return yield fetchUser(clap.userId); })))), savedBy: story === null || story === void 0 ? void 0 : story.savedBy.map((user) => user.userId) });
        return res.json(transformedStory);
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error while fetching story data" });
    }
});
exports.getStory = getStory;
const getAllStories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stories = yield prisma.story.findMany({
            where: {
                published: true,
            },
            select: {
                id: true,
                title: true,
                description: true,
                postedOn: true,
                published: true,
                clapsCount: true,
                savedBy: {
                    select: {
                        userId: true,
                    },
                },
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
        });
        // Map over stories to transform topics to an array of strings
        const transformedStries = stories.map((story) => (Object.assign(Object.assign({}, story), { topics: story.topics.map((topicObj) => topicObj.topic), savedBy: story === null || story === void 0 ? void 0 : story.savedBy.map((user) => user.userId) })));
        return res.json(transformedStries);
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error while fetching story data" });
    }
});
exports.getAllStories = getAllStories;
// create sstory
const createStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const user = req.user;
    const body = req.body;
    const coverImg = req.file;
    try {
        // data parsing remaining
        // Prepare topic IDs to connect
        let topicIdsToAdd = [];
        if (body.topics && body.topics.length > 0) {
            // Check if topics already exist in the database
            for (const topic of body.topics) {
                if (topic == "")
                    continue;
                const existingTopic = yield prisma.topics.findFirst({
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
                    const newTopic = yield prisma.topics.create({
                        data: {
                            topic: topic,
                        },
                    });
                    topicIdsToAdd.push(newTopic.id);
                }
            }
        }
        // Upload cover image to Cloudinary and get secure URL
        //@ts-ignore
        const secure_url = coverImg ? yield (0, cloudinary_1.uploadImageCloudinary)(coverImg) : "";
        // Create new blog post
        yield prisma.story.create({
            data: {
                title: body.title,
                content: body.content,
                description: body.description,
                postedOn: new Date(),
                published: body.published,
                authorId: (user === null || user === void 0 ? void 0 : user.id) || "",
                coverImage: secure_url,
                topics: {
                    connect: topicIdsToAdd.map((id) => ({ id: id })),
                },
            },
        });
        return res.json({ message: "Story created" });
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
    //@ts-ignore
    const user = req.user;
    const body = req.body;
    const coverImg = req.file;
    try {
        // body data parse remaining
        let topicIdsToAdd = [];
        if (body.topics && body.topics.length > 0) {
            // Check if topics already exist in the database
            for (const topic of body.topics) {
                if (topic == "")
                    continue;
                const existingTopic = yield prisma.topics.findFirst({
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
                    const newTopic = yield prisma.topics.create({
                        data: {
                            topic: topic,
                        },
                    });
                    topicIdsToAdd.push(newTopic.id);
                }
            }
        }
        // Get the current topics associated with the post
        const currentStory = yield prisma.story.findUnique({
            where: {
                id: body.id,
            },
            include: {
                topics: true,
            },
        });
        // Extract topic IDs of the current topics associated with the post
        const currentTopicIds = ((_a = currentStory === null || currentStory === void 0 ? void 0 : currentStory.topics) === null || _a === void 0 ? void 0 : _a.length)
            ? currentStory.topics.map((topic) => topic.id)
            : [];
        // Find the topic IDs to disconnect
        const topicIdsToDisconnect = currentTopicIds.length > 0 ? currentTopicIds === null || currentTopicIds === void 0 ? void 0 : currentTopicIds.filter((id) => !topicIdsToAdd.includes(id)) : [];
        // add new image link if added else set old url
        const existingPost = yield prisma.story.findUnique({
            where: {
                id: body.id,
            },
        });
        const currentCoverImage = existingPost === null || existingPost === void 0 ? void 0 : existingPost.coverImage;
        //@ts-ignore
        const secure_url = coverImg ? yield (0, cloudinary_1.uploadImageCloudinary)(coverImg) : currentCoverImage;
        // updating the blog
        yield prisma.story.update({
            where: {
                id: body.id,
                authorId: user === null || user === void 0 ? void 0 : user.id,
            },
            data: {
                title: body.title,
                content: body.content,
                description: body.description,
                published: body.published,
                coverImage: secure_url,
                topics: {
                    connect: topicIdsToAdd.length > 0 ? topicIdsToAdd.map((id) => ({ id: id })) : [], // Connect post with existing or newly created topics
                    disconnect: topicIdsToDisconnect.length > 0 ? topicIdsToDisconnect.map((id) => ({ id: id })) : [], // Disconnect post from topics that are no longer associated
                },
            },
        });
        return res.json({ message: "story updated" });
    }
    catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Error while updating story" });
    }
});
exports.upadateStory = upadateStory;
const deleteStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const user = req.user;
    const id = req.params.id;
    try {
        // deleting blog
        yield prisma.story.delete({
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
        return res.json({ message: "Error deleting blog" });
    }
});
exports.deleteStory = deleteStory;
const clapStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const user = req.user;
    const body = req.body;
    try {
        // parsing body
        const { success } = medium_clone_common_1.clapBlogSchema.safeParse(body);
        if (!success) {
            res.status(400);
            return res.json({ message: "Invalid request parameters" });
        }
        // If the user has already clapped, delete the existing clap record
        const existingClap = yield prisma.clap.findFirst({
            where: {
                userId: user === null || user === void 0 ? void 0 : user.id,
                storyId: body.postId,
            },
        });
        if (existingClap) {
            yield prisma.clap.delete({
                where: {
                    id: existingClap.id,
                },
            });
            return res.json({ message: "Clap removed." });
        }
        // creating new like record
        yield prisma.clap.create({
            data: {
                userId: user === null || user === void 0 ? void 0 : user.id,
                storyId: body.postId,
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
    //@ts-ignore
    const user = req.user;
    const body = req.body;
    try {
        // parsing body
        const { success } = medium_clone_common_1.saveBlogSchema.safeParse(body);
        if (!success) {
            res.status(400);
            return res.json({ message: "Invalid request parameters" });
        }
        // If the user has saved, delete the existing saved record
        const existingSave = yield prisma.savedStory.findFirst({
            where: {
                userId: user === null || user === void 0 ? void 0 : user.id,
                storyId: body.postId,
            },
        });
        if (existingSave) {
            yield prisma.savedStory.delete({
                where: {
                    id: existingSave.id,
                },
            });
            return res.json({ message: "story unsaved" });
        }
        // creating new save record
        yield prisma.savedStory.create({
            data: {
                userId: user === null || user === void 0 ? void 0 : user.id,
                storyId: body.postId,
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
