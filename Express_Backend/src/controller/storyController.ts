import {
	clapStorySchema,
	clapStorySchemaType,
	createStorySchema,
	createStorySchemaType,
	followTopicSchema,
	followTopicSchemaType,
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
		const secure_url = coverImg ? await uploadImageCloudinary(coverImg) : currentCoverImage;

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

			if (existingReadingHistory) {
				await prisma.readingHistory.update({
					where: {
						id: existingReadingHistory.id,
					},
					data: {
						readAt: new Date(),
					},
				});
				console.log("Story already exists in reading history");
			} else {
				await prisma.readingHistory.create({
					data: {
						storyId: id,
						userId: decodedToken?.id as string,
					},
				});
			}
		}

		return;
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error while fetching story data" });
	}
};

export const getAllStories = async (req: Request, res: Response) => {
	try {
		const stories = await prisma.story.findMany({
			where: {
				published: true,
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

	try {
		const stories = await prisma.story.findMany({
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

	try {
		const followdAuthors = await prisma.user.findFirst({
			where: {
				id: user?.id,
			},
			select: {
				following: {
					select:{
						followingId: true,
					}
				}
			},
		});

		console.log(followdAuthors);
		

		const stories = await prisma.story.findMany({
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