import {
	clapStorySchema,
	clapStorySchemaType,
	createStorySchema,
	createStorySchemaType,
	editReplySchema,
	editReplySchemaType,
	editResponseSchema,
	editResponseSchemaType,
	followTopicSchema,
	followTopicSchemaType,
	makeReplyToResponseSchema,
	makeReplyToResponseSchemaType,
	makeResponseSchema,
	makeResponseSchemaType,
	updateStorySchema,
	updateStorySchemaType,
} from "@aayushlad/medium-clone-common";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../db/prismaClient";
import { uploadImageCloudinary } from "../utils/cloudinary";

export const createStory = async (req: Request, res: Response) => {
	const user = req.user;
	const body: createStorySchemaType = req.body;
	const coverImg = req.file;

	try {
		body.published = JSON.parse(req.body.published as string);
		body.topics = req.body.topics.split(",");

		const { success } = createStorySchema.safeParse(body);
		if (!success) {
			res.status(400);
			return res.json({ message: "Invalid request parameters" });
		}

		// Prepare topic IDs to connect
		let topicIdsToAdd: string[] = [];
		if (body.topics && body.topics.length > 0) {
			// Check if topics already exist in the database
			for (const topic of body.topics) {
				if (topic == "") continue;

				const existingTopic = await prisma.topics.findFirst({
					where: {
						topic: topic,
					},
				});

				if (existingTopic) {
					// If topic already exists, get its ID
					topicIdsToAdd.push(existingTopic.id);
				} else {
					// If topic doesn't exist, create it and get its ID
					const newTopic = await prisma.topics.create({
						data: {
							topic: topic,
						},
					});
					topicIdsToAdd.push(newTopic.id);
				}
			}
		}

		// Upload cover image to Cloudinary and get secure URL
		const secure_url = coverImg ? await uploadImageCloudinary(coverImg) : "";

		// Create new story
		const newStory = await prisma.story.create({
			data: {
				title: body.title,
				content: body.content,
				description: body.description,
				postedOn: new Date(),
				published: body.published,
				authorId: user?.id || "",
				coverImg: secure_url,
				topics: {
					connect: topicIdsToAdd.map((id) => ({ id: id })),
				},
			},
		});

		return res.json({ id: newStory.id });
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error while creating story" });
	}
};

export const upadateStory = async (req: Request, res: Response) => {
	const user = req.user;
	const body: updateStorySchemaType = req.body;
	const coverImg = req.file;

	console.log("update: ", body);
	console.log("coverImg: ", coverImg);

	try {
		body.published = JSON.parse(req.body.published as string);
		body.topics = req.body.topics.split(",");

		const { success } = updateStorySchema.safeParse(body);
		if (!success) {
			res.status(400);
			return res.json({ message: "Invalid request parameters" });
		}

		// Prepare topic IDs to connect
		let topicIdsToAdd: string[] = [];
		if (body.topics && body.topics.length > 0) {
			// Check if topics already exist in the database
			for (const topic of body.topics) {
				if (topic == "") continue;

				const existingTopic = await prisma.topics.findFirst({
					where: {
						topic: topic,
					},
				});

				if (existingTopic) {
					// If topic already exists, get its ID
					topicIdsToAdd.push(existingTopic.id);
				} else {
					// If topic doesn't exist, create it and get its ID
					const newTopic = await prisma.topics.create({
						data: {
							topic: topic,
						},
					});

					topicIdsToAdd.push(newTopic.id);
				}
			}
		}

		// Get the current topics associated with the post
		const currentStory = await prisma.story.findUnique({
			where: {
				id: body.id,
			},
			include: {
				topics: true,
			},
		});

		// Extract topic IDs of the current topics associated with the post
		const currentTopicIds: string[] =
			currentStory?.topics?.length && body.published
				? currentStory.topics.map((topic) => topic.id)
				: [];

		// Find the topic IDs to disconnect
		const topicIdsToDisconnect: string[] =
			currentTopicIds.length > 0 && body.published
				? currentTopicIds?.filter((id) => !topicIdsToAdd.includes(id))
				: [];

		// add new image link if added else set old url
		const existingPost = await prisma.story.findUnique({
			where: {
				id: body.id,
			},
		});
		const currentCoverImage = existingPost?.coverImg;
		const secure_url = coverImg
			? await uploadImageCloudinary(coverImg, currentCoverImage)
			: currentCoverImage;

		// updating the story
		await prisma.story.update({
			where: {
				id: body.id,
				authorId: user?.id,
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
					disconnect:
						topicIdsToDisconnect.length > 0 ? topicIdsToDisconnect.map((id) => ({ id: id })) : [], // Disconnect post from topics that are no longer associated
				},
			},
		});

		// Updating topics count
		if (topicIdsToAdd) {
			await prisma.topics.updateMany({
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
			await prisma.topics.updateMany({
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
			await prisma.topics.updateMany({
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
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error while updating story" });
	}
};

export const getStory = async (req: Request, res: Response) => {
	const id = req.params.id;
	const token: string | undefined = req.cookies?.Authorization;

	try {
		// finding story
		const story = await prisma.story.findUnique({
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

		const transformedStory = {
			...story,
			topics: story?.topics.map((topicObj: { topic: string }) => topicObj.topic),
		};

		res.json(transformedStory);

		// Update reading history
		if (token) {
			const decodedToken = jwt.decode(token as string) as JwtPayload;

			const existingReadingHistory = await prisma.readingHistory.findFirst({
				where: {
					userId: decodedToken?.id as string,
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
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error while fetching story data" });
	}
};

export const getAllStories = async (req: Request, res: Response) => {
	const page = parseInt(req.query.page as string) || 1;
	const pageSize = parseInt(req.query.pageSize as string) || 5;

	try {
		const stories = await prisma.story.findMany({
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
		const transformedStries = stories.map((story) => ({
			...story,
			topics: story.topics.map((topicObj) => topicObj.topic),
		}));

		return res.json(transformedStries);
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error while fetching story data" });
	}
};

export const getStoriesByTopics = async (req: Request, res: Response) => {
	const topics = req.params.topics;
	const page = parseInt(req.query.page as string) || 1;
	const pageSize = parseInt(req.query.pageSize as string) || 5;

	try {
		const stories = await prisma.story.findMany({
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
			stories: stories.map((story) => ({
				...story,
				topics: story.topics.map((topicObj) => topicObj.topic),
			})),
		};

		return res.json(transformedStories);
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error while fetching story data" });
	}
};

export const getStoriesByAuthor = async (req: Request, res: Response) => {
	const user = req.user;
	const page = parseInt(req.query.page as string) || 1;
	const pageSize = parseInt(req.query.pageSize as string) || 5;

	try {
		const followdAuthors = await prisma.user.findFirst({
			where: {
				id: user?.id,
			},
			select: {
				following: {
					select: {
						followingId: true,
					},
				},
			},
		});

		const stories = await prisma.story.findMany({
			skip: (page - 1) * pageSize,
			take: pageSize,
			where: {
				published: true,
				author: {
					id: {
						in: followdAuthors?.following.map((author) => author.followingId),
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
			stories: stories.map((story) => ({
				...story,
				topics: story.topics.map((topicObj) => topicObj.topic),
			})),
		};

		return res.json(transformedStories);
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error while fetching story data" });
	}
};

export const clapStory = async (req: Request, res: Response) => {
	const user = req.user;
	const body: clapStorySchemaType = req.body;

	try {
		const { success } = clapStorySchema.safeParse(body);
		if (!success) {
			res.status(400);
			return res.json({ message: "Invalid request parameters" });
		}

		// If the user has already clapped, delete the existing clap record
		const existingClap = await prisma.clap.findFirst({
			where: {
				userId: user?.id,
				storyId: body.storyId,
			},
		});
		if (existingClap) {
			await prisma.clap.delete({
				where: {
					id: existingClap.id,
				},
			});

			await prisma.story.update({
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
		await prisma.clap.create({
			data: {
				userId: user?.id as string,
				storyId: body.storyId,
			},
		});

		await prisma.story.update({
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
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error claping" });
	}
};

export const saveStory = async (req: Request, res: Response) => {
	const user = req.user;
	const body: clapStorySchemaType = req.body;

	try {
		const { success } = clapStorySchema.safeParse(body);
		if (!success) {
			res.status(400);
			return res.json({ message: "Invalid request parameters" });
		}

		// If the user has saved, delete the existing saved record
		const existingSave = await prisma.savedStory.findFirst({
			where: {
				userId: user?.id,
				storyId: body.storyId,
			},
		});
		if (existingSave) {
			await prisma.savedStory.delete({
				where: {
					id: existingSave.id,
				},
			});

			return res.json({ message: "story unsaved" });
		}

		// creating new save record
		await prisma.savedStory.create({
			data: {
				userId: user?.id as string,
				storyId: body.storyId,
			},
		});

		return res.json({ message: "story saved" });
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error saving story" });
	}
};

export const deleteStory = async (req: Request, res: Response) => {
	const user = req.user;
	const id = req.params.id;

	try {
		// Find and delete any related SavedStory records
		await prisma.savedStory.deleteMany({
			where: {
				storyId: id,
			},
		});

		// deleting delete
		await prisma.story.delete({
			where: {
				id: id,
				authorId: user?.id,
			},
		});

		res.status(201);
		return res.json({ message: "story deleted" });
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error deleting story" });
	}
};

// get svaed stories
export const getSavedStories = async (req: Request, res: Response) => {
	const user = req.user;

	try {
		const savedStoryIds = await prisma.savedStory.findMany({
			where: {
				userId: user?.id,
			},
			select: {
				storyId: true,
			},
		});

		const stories = await prisma.story.findMany({
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
		const transformedStries = stories.map((story) => ({
			...story,
			topics: story.topics.map((topicObj) => topicObj.topic),
		}));

		return res.json(transformedStries);
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error fetching saved stories" });
	}
};

// get reading history
export const getReadingHistory = async (req: Request, res: Response) => {
	const user = req.user;

	try {
		const readingHistoryIds = await prisma.readingHistory.findMany({
			where: {
				userId: user?.id,
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

		const stories = await prisma.story.findMany({
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
		const transformedStries = stories.map((story) => ({
			...story,
			topics: story.topics.map((topicObj) => topicObj.topic),
		}));

		return res.json(transformedStries);
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error fetching reading history" });
	}
};

export const getTopic = async (req: Request, res: Response) => {
	const topicName = req.params.topic;

	try {
		const topic = await prisma.topics.findFirst({
			where: {
				topic: topicName,
			},
		});

		if (!topic) {
			res.status(400);
			return res.json({ message: "Topic not found" });
		}

		return res.json(topic);
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error fetching topic data" });
	}
};

export const followTopic = async (req: Request, res: Response) => {
	const user = req.user;
	const body: followTopicSchemaType = req.body;

	try {
		const { success } = followTopicSchema.safeParse(body);
		if (!success) {
			res.status(400);
			return res.json({ message: "Invalid request parameters" });
		}

		// if user alredy follows, then unfollow
		const existingFollow = await prisma.followedTopic.findFirst({
			where: {
				userId: user?.id,
				topicId: body.topicId,
			},
		});

		if (existingFollow) {
			await prisma.followedTopic.delete({
				where: {
					id: existingFollow.id,
				},
			});

			await prisma.topics.update({
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
		await prisma.followedTopic.create({
			data: {
				userId: user?.id as string,
				topicId: body.topicId,
			},
		});

		await prisma.topics.update({
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
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error following topic" });
	}
};

// make a response
export const makeResponse = async (req: Request, res: Response) => {
	const user = req.user;
	const body: makeResponseSchemaType = req.body;

	try {
		const { success } = makeResponseSchema.safeParse(body);
		if (!success) {
			res.status(400);
			return res.json({ message: "Invalid request parameters" });
		}

		// creating new response record
		const response = await prisma.response.create({
			data: {
				content: body.content,
				storyId: body.storyId,
				userId: user?.id as string,
			},
		});

		const newResponse = await prisma.response.findFirst({
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
		await prisma.story.update({
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
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error making response" });
	}
};

// get responses by story id
export const getResponseByStoryId = async (req: Request, res: Response) => {
	const storyId = req.params.storyId;
	const page = parseInt(req.query.page as string) || 1;
	const pageSize = parseInt(req.query.pageSize as string) || 6;

	try {
		const responses = await prisma.response.findMany({
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
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error fetching response" });
	}
};

// edit a response
export const editResponse = async (req: Request, res: Response) => {
	const user = req.user;
	const body: editResponseSchemaType = req.body;

	try {
		const { success } = editResponseSchema.safeParse(body);
		if (!success) {
			res.status(400);
			return res.json({ message: "Invalid request parameters" });
		}

		// updating response
		const response = await prisma.response.update({
			where: {
				id: body.responseId,
				userId: user?.id as string,
			},
			data: {
				content: body.content,
			},
		});

		const updatedResponse = await prisma.response.findFirst({
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
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error editing response" });
	}
};

// delete a response
export const deleteResponse = async (req: Request, res: Response) => {
	const user = req.user;
	const responseId = req.params.responseId;

	try {
		// deleting subresponses
		await prisma.subResponse.deleteMany({
			where: {
				responseId: responseId,
			},
		});

		// deleting the response
		const response = await prisma.response.delete({
			where: {
				id: responseId,
				userId: user?.id as string,
			},
		});

		res.status(204).json({ message: "response deleted" });

		// updating responseCount in story
		await prisma.story.update({
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
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error deleting response" });
	}
};

// make a reply to subresponse
export const makeReplyToResponse = async (req: Request, res: Response) => {
	const user = req.user;
	const body: makeReplyToResponseSchemaType = req.body;

	try {
		const { success } = makeReplyToResponseSchema.safeParse(body);
		if (!success) {
			res.status(400);
			return res.json({ message: "Invalid request parameters" });
		}

		// creating new subresponse record
		const reply = await prisma.subResponse.create({
			data: {
				content: body.content,
				responseId: body.responseId,
				userId: user?.id as string,
			},
		});

		const newRelay = await prisma.subResponse.findFirst({
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
		await prisma.response.update({
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
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error making response" });
	}
};

// get reply by response id
export const getReplyByResponseId = async (req: Request, res: Response) => {
	const responseId = req.params.responseId;
	const page = parseInt(req.query.page as string) || 1;
	const pageSize = 4;

	try {
		const replies = await prisma.subResponse.findMany({
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
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error fetching reply" });
	}
};

// edit a reply to response
export const editReply = async (req: Request, res: Response) => {
	const user = req.user;
	const body: editReplySchemaType = req.body;

	try {
		const { success } = editReplySchema.safeParse(body);
		if (!success) {
			res.status(400);
			return res.json({ message: "Invalid request parameters" });
		}

		// creating new subresponse record
		const reply = await prisma.subResponse.update({
			where: {
				id: body.responseId,
				userId: user?.id as string,
			},
			data: {
				content: body.content,
			},
		});

		const updatedReply = await prisma.subResponse.findFirst({
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
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error editing reply" });
	}
};

// dekete a response
export const deleteReply = async (req: Request, res: Response) => {
	const user = req.user;
	const replyId = req.params.replyId;

	try {
		// deleting the response
		const response = await prisma.subResponse.delete({
			where: {
				id: replyId,
				userId: user?.id as string,
			},
		});

		res.status(204).json({ message: "reply deleted" });

		// updating replyCount in reply
		await prisma.response.update({
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
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error deleting reply" });
	}
};
