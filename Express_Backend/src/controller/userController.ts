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

// const signUpUserSchema = zod.object({
// 	userName: zod.string().regex(/^\S*$/),
// 	email: zod.string().email(),
// 	password: zod.string().min(6),
// });

// type signUpUserSchemaType = zod.infer<typeof signUpUserSchema>;

export const signUpUser = async (req: Request, res: Response) => {
	const body: signUpUserSchemaType = req.body;

	try {
		// parsing request body
		const { success } = signUpUserSchema.safeParse(body);
		if (!success) {
			res.status(400);
			return res.json({ message: "Invalid request parameters" });
		}

		// check for repitative email
		const repeatEmail = await prisma.user.findUnique({
			where: {
				email: body.email,
			},
		});
		if (repeatEmail) {
			res.status(400);
			return res.json({ message: "User alredy exist with this email" });
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
		const result = await bcrypt.compare(body.password, user.password);
		if (!result) {
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
			},
		});

		if (!userData) {
			res.status(404);
			return res.json({ message: "User not found" });
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
				stories: {
					select: {
						id: true,
						title: true,
						description: true,
						postedOn: true,
						clapsCount: true,
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
				},
			},
		});

		if (!user) {
			res.status(404);
			return res.json({ error: "User do not exist!" });
		}

		// function that fetches user data
		async function fetchUser(id: string) {
			console.log(id);

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
			stories: user?.stories.map((story) => ({
				...story,
				topics: story.topics.map((topic) => topic.topic),
			})),
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

// const updateUserSchema = zod.object({
// 	userName: zod.string().regex(/^\S*$/),
// 	bio: zod.string(),
// });

// type updateUserSchemaType = zod.infer<typeof updateUserSchema>;

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

// const followUserSchema = zod.object({
// 	userIdToFollow: zod.string(),
// });

// type followUserSchemaType = zod.infer<typeof followUserSchema>;

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