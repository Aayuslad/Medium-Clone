import {
	followUserSchema,
	followUserSchemaType,
	signUpUserSchema,
	signUpUserSchemaType,
	signinUserSchema,
	signinUserSchemaType,
	updateUserAboutSectionSchema,
	updateUserAboutSectionSchemaType,
	updateUserSchema,
	updateUserSchemaType,
} from "@aayushlad/medium-clone-common";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../db/prismaClient";
import { uploadImageCloudinary } from "../utils/cloudinary";
const JWT_SECRET = process.env.JWT_SECRET;

export const signUpUser = async (req: Request, res: Response) => {
	const body: signUpUserSchemaType = req.body;

	try {
		// parsing request body
		const { success } = signUpUserSchema.safeParse(body);
		if (!success) {
			res.status(400);
			return res.json({ message: "Invalid request parameters" });
		}

		// cheking token of cloudflare turnstyle
		const formData = new FormData();
		formData.append("secret", process.env.ReCAPTCHA_SECRET_KEY as string);
		formData.append("response", body.token);
		const result = await fetch("https://www.google.com/recaptcha/api/siteverify", {
			body: formData,
			method: "POST",
		});
		const isChalangeSuccess = (await result.json()).success;
		if (!isChalangeSuccess) return res.status(400).json({ message: "Invalid captcha" });

		// check for repitative email and username
		const repeatEmail = await prisma.user.findUnique({
			where: {
				email: body.email,
			},
		});
		if (repeatEmail) {
			res.status(400);
			return res.json({ message: "User alredy exist with this email" });
		}
		const repeatUsername = await prisma.user.findUnique({
			where: {
				userName: body.userName,
			},
		});
		if (repeatUsername) {
			res.status(400);
			return res.json({ message: "User alredy exist with this username" });
		}

		// hashing password
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(body.password, salt);

		// creating user
		const user = await prisma.user.create({
			data: {
				email: body.email,
				password: hash,
				userName: body.userName,
			},
		});

		// signing jwt token and setting in cookies
		const token = jwt.sign({ id: user.id }, String(JWT_SECRET));
		res.cookie("Authorization", token, {
			httpOnly: true,
			secure: true,
			sameSite: "none",
		});

		return res.json({ message: "Signged up" });
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error while signing up" });
	}
};

export const signInUser = async (req: Request, res: Response) => {
	const body: signinUserSchemaType = req.body;

	try {
		// parsing request body
		const { success } = signinUserSchema.safeParse(body);
		if (!success) {
			res.status(400);
			return res.json({ message: "Invalid request parameters" });
		}

		// cheking token of cloudflare turnstyle
		const formData = new FormData();
		formData.append("secret", process.env.ReCAPTCHA_SECRET_KEY as string);
		formData.append("response", body.token);
		const result = await fetch("https://www.google.com/recaptcha/api/siteverify", {
			body: formData,
			method: "POST",
		});
		const isChalangeSuccess = (await result.json()).success;
		if (!isChalangeSuccess) {
			res.status(400);
			return res.json({ message: "Invalid captcha" });
		}

		// find user
		const user = await prisma.user.findFirst({
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
		const passwordresult = await bcrypt.compare(body.password, user.password);
		if (!passwordresult) {
			res.status(401);
			return res.json({ message: "Incorrect password" });
		}

		// sign jwt token and setting in cookies
		const token = jwt.sign({ id: user.id }, String(JWT_SECRET));
		res.cookie("Authorization", token, {
			httpOnly: true,
			secure: true,
			sameSite: "none",
		});

		return res.json({ message: "Signged in" });
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error while signing in" });
	}
};

export const signOutUser = async (req: Request, res: Response) => {
	try {
		// removing authorization token
		res.clearCookie("Authorization", {
			httpOnly: true,
			secure: true,
			sameSite: "none",
		});

		return res.json({ message: "Signed out" });
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error while signing out" });
	}
};

export const getUser = async (req: Request, res: Response) => {
	const user = req.user;

	try {
		// find user
		const userData = await prisma.user.findUnique({
			where: {
				id: user?.id,
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
			const topics = await prisma.topics.findMany({
				take: 10,
				orderBy: {
					storiesCount: "desc",
				},
				select: {
					topic: true,
					id: true,
				},
			});

			res.status(404);
			return res.json({ message: "User not found", topics: topics });
		}

		const transformedUser = {
			...userData,
			savedStories: userData?.savedStories.map((story) => story.storyId),
			claps: userData.claps.map((clap) => clap.storyId),
			following: userData.following.map((user) => user.followingId),
			followedTopics: userData.followedTopics.map((topic) => ({
				topic: topic.topic.topic,
				id: topic.topic.id,
			})),
			mutedAuthors: userData.mutedAuthors.map((author) => author.authorId),
		};

		return res.json(transformedUser);
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error while fetching user data" });
	}
};

export const getUserProfile = async (req: Request, res: Response) => {
	const id = req.params.id;

	try {
		const user = await prisma.user.findUnique({
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
		async function fetchUser(id: string) {
			const res = await prisma.user.findUnique({
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
		}

		const transformedUser = {
			...user,
			topFiveFollowing: await Promise.all(
				user.following.map(async (following) => await fetchUser(following.followingId)),
			),
			following: "",
		};

		return res.json(transformedUser);
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error while fetching user data" });
	}
};

export const getUserStories = async (req: Request, res: Response) => {
	const id = req.params.id;
	const page = parseInt(req.query.page as string) || 1;
	const pageSize = parseInt(req.query.pageSize as string) || 5;

	try {
		const stories = await prisma.story.findMany({
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

		const modifiedStories = stories.map((story) => ({
			...story,
			topics: story.topics.map((topic) => topic.topic),
		}));

		return res.json(modifiedStories);
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error while fetching user data" });
	}
};

export const updateUser = async (req: Request, res: Response) => {
	const user = req.user;
	const body: updateUserSchemaType = req.body;
	const profileImg = req.file;

	console.log(body);

	try {
		const { success } = updateUserSchema.safeParse(body);
		if (!success) {
			res.status(400);
			return res.json({ error: "Invalid request parameters" });
		}

		// Check if the name has been changed and if, Check for new name already exists in the database
		if (body.userName !== user?.userName) {
			const existingUser = await prisma.user.findUnique({
				where: {
					userName: body.userName,
				},
			});

			if (existingUser) {
				return res.json({ error: "User alredy exist" });
			}
		}

		// add new image link if added else set old url
		const oldProfile = await prisma.user.findUnique({
			where: {
				id: user?.id,
			},
			select: {
				profileImg: true,
			},
		});
		const currentProfileImg = oldProfile?.profileImg;
		const secure_url = profileImg
			? await uploadImageCloudinary(profileImg, currentProfileImg)
			: currentProfileImg;

		// update story
		await prisma.user.update({
			where: {
				id: user?.id,
			},
			data: {
				userName: body.userName,
				bio: body.bio,
				profileImg: secure_url,
			},
		});

		return res.json({ message: "User updated" });
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error while updating user data" });
	}
};

export const updateUserAboutSection = async (req: Request, res: Response) => {
	const user = req.user;
	const body: updateUserAboutSectionSchemaType = req.body;

	try {
		// parse body
		const { success } = updateUserAboutSectionSchema.safeParse(body);
		if (!success) {
			res.status(400);
			return res.json({ error: "Invalid request parameters" });
		}

		// update post
		await prisma.user.update({
			where: {
				id: user?.id,
			},
			data: {
				about: body.about,
			},
		});

		return res.json({ message: "User updated" });
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error while updating user data" });
	}
};

export const followUser = async (req: Request, res: Response) => {
	const user = req.user;

	const body: followUserSchemaType = req.body;

	try {
		const { success } = followUserSchema.safeParse(body);
		if (!success) {
			res.status(400);
			return res.json({ error: "Invalid request parameters" });
		}

		// Retrieve the user to follow
		const userToFollow = await prisma.user.findFirst({
			where: {
				id: body.userIdToFollow,
			},
		});
		if (!userToFollow) {
			res.status(400);
			return res.json({ error: "user does not exist" });
		}

		// Check if the user is already following the specified user
		const existingFollow = await prisma.follow.findFirst({
			where: {
				followerId: user?.id,
				followingId: body.userIdToFollow,
			},
		});

		// If already following, unfollow the user
		if (existingFollow) {
			await prisma.follow.delete({
				where: {
					id: existingFollow.id,
				},
			});

			// Decrement the follower count for the user being unfollowed
			await prisma.user.update({
				where: { id: body.userIdToFollow },
				data: { followersCount: { decrement: 1 } },
			});

			// Decrement the following count for the current user
			await prisma.user.update({
				where: { id: user?.id },
				data: { followingCount: { decrement: 1 } },
			});

			return res.json({ message: "User unfollowed successfully" });
		}

		// If not already following, create a new follow relationship
		await prisma.follow.create({
			data: {
				followerId: user?.id as string,
				followingId: body.userIdToFollow,
			},
		});

		// Increment the follower count for the user being followed
		await prisma.user.update({
			where: { id: body.userIdToFollow },
			data: { followersCount: { increment: 1 } },
		});

		// Increment the following count for the current user
		await prisma.user.update({
			where: { id: user?.id },
			data: { followingCount: { increment: 1 } },
		});

		return res.json({ message: "User followed successfully" });
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error while updating user" });
	}
};

// mute an author for user
export const muteAuthor = async (req: Request, res: Response) => {
	const user = req.user;
	const authorId = req.params.authorId;

	try {
		const existingMutedAuthor = await prisma.mutedAuthors.findFirst({
			where: {
				userId: user?.id,
				authorId: authorId,
			},
		});

		if (existingMutedAuthor) {
			await prisma.mutedAuthors.delete({
				where: {
					id: existingMutedAuthor.id,
				},
			});

			return res.json({ message: "Author unmuted successfully" });
		} else {
			await prisma.mutedAuthors.create({
				data: {
					userId: user?.id || "",
					authorId: authorId,
				},
			});

			return res.json({ message: "Author muted successfully" });
		}
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error while muting author" });
	}
};

// get user following authors
export const getUserFollowingAuthors = async (req: Request, res: Response) => {
	const user = req.user;
	const page = parseInt(req.query.page as string) || 1;
	const pageSize = parseInt(req.query.pageSize as string) || 12;

	try {
		const followingAuthors = await prisma.follow.findMany({
			take: pageSize,
			skip: (page - 1) * pageSize,
			where: {
				followerId: user?.id,
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
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error while getting user following authors" });
	}
};

// get user muted authors
export const getUserMutedAuthors = async (req: Request, res: Response) => {
	const user = req.user;
	const page = parseInt(req.query.page as string) || 1;
	const pageSize = parseInt(req.query.pageSize as string) || 12;

	try {
		const mutedAuthors = await prisma.mutedAuthors.findMany({
			take: pageSize,
			skip: (page - 1) * pageSize,
			where: {
				userId: user?.id,
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
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error while getting user muted authors" });
	}
};

// get random authors
export const getRandomAuthors = async (req: Request, res: Response) => {
	const page = parseInt(req.query.page as string) || 1;
	const pageSize = parseInt(req.query.pageSize as string) || 12;

	try {
		const randomAuthors = await prisma.user.findMany({
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
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error getting random authors" });
	}
};

// get random topics
export const getRandomTopics = async (req: Request, res: Response) => {
	const page = parseInt(req.query.page as string) || 1;
	const pageSize = parseInt(req.query.pageSize as string) || 12;

	try {
		const topics = await prisma.topics.findMany({
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
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error while getting user muted authors" });
	}
};

// global search route
export const globalSearchBox = async (req: Request, res: Response) => {
	const query = req.query.query as string;

	try {
		const [storiesStartsWith, authorsStartsWith, topicsStartsWith] = await prisma.$transaction([
			prisma.story.findMany({
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
			prisma.user.findMany({
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
			prisma.topics.findMany({
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

		const additionalStories =
			storiesCount < 3
				? await prisma.story.findMany({
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

		const additionalAuthors =
			authorsCount < 3
				? await prisma.user.findMany({
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

		const additionalTopics =
			topicsCount < 3
				? await prisma.topics.findMany({
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
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error while getting search results" });
	}
};

// TODO: get the search results sorted, first the results apper for startswith and then for contains
export const getSerchResultPageStories = async (req: Request, res: Response) => {
	const query = req.query.query as string;
	const page = parseInt(req.query.page as string) || 1;
	const pageSize = parseInt(req.query.pageSize as string) || 8;

	try {
		const stories = await prisma.story.findMany({
			take: pageSize,
			skip: (page - 1) * pageSize,
			where: {
				OR: [
					{
						title: {
							startsWith: query,
							mode: "insensitive",
						},
					},
					{
						title: {
							contains: query,
							mode: "insensitive",
						},
					},
				],
				published: true,
			},
			orderBy: [
				{
					title: "asc",
				},
			],
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
		return res.json({ message: "Error while getting search results" });
	}
};

// TODO: get the search results sorted, first the results apper for startswith and then for contains
export const getSerchResultPageAuthors = async (req: Request, res: Response) => {
	const query = req.query.query as string;
	const page = parseInt(req.query.page as string) || 1;
	const pageSize = parseInt(req.query.pageSize as string) || 8;

	try {
		const authors = await prisma.user.findMany({
			take: pageSize,
			skip: (page - 1) * pageSize,
			where: {
				OR: [
					{
						userName: {
							startsWith: query,
							mode: "insensitive",
						},
					},
					{
						userName: {
							contains: query,
							mode: "insensitive",
						},
					},
				],
			},
			select: {
				id: true,
				bio: true,
				userName: true,
				profileImg: true,
				followersCount: true,
			},
		});

		return res.json(authors);
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error while getting search results" });
	}
};

// TODO: get the search results sorted, first the results apper for startswith and then for contains
export const getSerchResultPageTopics = async (req: Request, res: Response) => {
	const query = req.query.query as string;
	const page = parseInt(req.query.page as string) || 1;
	const pageSize = parseInt(req.query.pageSize as string) || 8;

	try {
		const topics = await prisma.topics.findMany({
			take: pageSize,
			skip: (page - 1) * pageSize,
			where: {
				OR: [
					{
						topic: {
							startsWith: query,
							mode: "insensitive",
						},
					},
					{
						topic: {
							contains: query,
							mode: "insensitive",
						},
					},
				],
			},
			select: {
				id: true,
				topic: true,
				followersCount: true,
				storiesCount: true,
			},
		});

		return res.json(topics);
	} catch (error) {
		console.log(error);
		res.status(400);
		return res.json({ message: "Error while getting search results" });
	}
};

// get right container data
export const getUserRecomendations = async (req: Request, res: Response) => {
	const userId = req.query.userId as string;

	try {
		const recommendedTopics = await prisma.topics.findMany({
			take: 7,
			select: {
				topic: true,
			},
		});

		const whoToFollow = await prisma.user.findMany({
			take: 3,
			select: {
				id: true,
				userName: true,
				profileImg: true,
				bio: true,
			},
		});

		const recentlySaved = userId
			? await prisma.savedStory.findMany({
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
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
};
