import {
	signUpSchema,
	signUpSchemaType,
	signinSchema,
	signinSchemaType,
	userType,
} from "@aayushlad/medium-clone-common";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import { uploadImageCloudinary } from "../utils/cloudinary";

// signup controller
export const signup = async function (ctx: Context) {
	const prisma = new PrismaClient({
		datasourceUrl: ctx.env?.DATABASE_URL,
	}).$extends(withAccelerate());

	const body: signUpSchemaType = await ctx.req.json();

	// parsing request body
	const { success } = signUpSchema.safeParse(body);
	if (!success) {
		ctx.status(400);
		return ctx.json({ error: "Invalid request parameters" });
	}

	try {
		// cheking for reapiting email
		const repeatEmail = await prisma.user.findUnique({
			where: {
				email: body.email,
			},
		});
		if (repeatEmail) {
			ctx.status(400);
			return ctx.json({ error: "User alredy exist with this email" });
		}

		// cheking for repeaiting name
		const repeatName = await prisma.user.findUnique({
			where: {
				name: body.name,
			},
		});
		if (repeatName) {
			ctx.status(400);
			return ctx.json({ error: "Username alredy exist" });
		}

		// creating user
		const user = await prisma.user.create({
			data: {
				email: body.email,
				password: body.password,
				name: body.name,
			},
		});

		// sign jwt token
		const jwt = await sign({ id: user.id }, ctx.env.JWT_SECRET);

		// setting jwt token
		setCookie(ctx, "Authorisation", jwt, {
			httpOnly: true,
			secure: true,
			sameSite: "None",
		});

		return ctx.json({ message: "Sucessfully signed up" });
	} catch (e) {
		ctx.status(403);
		console.log(e);
		return ctx.json({ error: "error while signing up" });
	}
};

// signin ccontroller
export const signin = async function (ctx: Context) {
	const prisma = new PrismaClient({
		datasourceUrl: ctx.env?.DATABASE_URL,
	}).$extends(withAccelerate());

	const body: signinSchemaType = await ctx.req.json();

	// parse reqest body
	const { success } = signinSchema.safeParse(body);
	if (!success) {
		ctx.status(400);
		return ctx.json({ error: "Invalid request parameters" });
	}

	try {
		// find user 
		const user = await prisma.user.findFirst({
			where: {
				OR: [
					{
						email: body.emailOrName,
					},
					{
						name: body.emailOrName,
					},
				],
			},
		});

		if (!user) {
			ctx.status(400);
			return ctx.json({ error: "User does not exist" });
		}

		// cheking for password
		if (user.password !== body.password) {
			ctx.status(400);
			return ctx.json({ error: "Incorrect password" });
		}

		// signinig jwt token
		const jwt = await sign({ id: user.id }, ctx.env.JWT_SECRET);

		// setting jwt token
		setCookie(ctx, "Authorisation", jwt, {
			httpOnly: true,
			secure: true,
			sameSite: "None",
		});

		return ctx.json({ message: "Successfully signed in" });
	} catch (e) {
		ctx.status(403);
		console.log(e);
		return ctx.json({ error: "error while signing in" });
	}
};

// sign out user
export const signOut = async function (ctx: Context) {
	try {
		// removing jwt token
		deleteCookie(ctx, "Authorisation", {
			httpOnly: true,
			secure: true,
			sameSite: "None",
		});

		return ctx.json({ message: "Logged out" });
	} catch (e) {
		ctx.status(403);
		console.log(e);
		return ctx.json({ error: "error while signing out" });
	}
};

// get user data
export const getUser = async function (ctx: Context) {
	const prisma = new PrismaClient({
		datasourceUrl: ctx.env?.DATABASE_URL,
	}).$extends(withAccelerate());

	const user: userType = ctx.get("user");

	try {
		// find user
		const userData = await prisma.user.findUnique({
			where: {
				id: user?.id,
			},
			select: {
				id: true,
				name: true,
				email: true,
				bio: true,
				about: true,
				profileImg: true,
			},
		});

		if (!userData) {
			ctx.status(404);
			return ctx.json({ error: "User not found" });
		}

		return ctx.json(userData);
	} catch (e) {
		ctx.status(500);
		return ctx.json({ error: "Error fetching user" });
	}
};

// get another user profile
export const getOtherUserProfile = async (ctx: Context) => {
	const prisma = new PrismaClient({
		datasourceUrl: ctx.env?.DATABASE_URL,
	}).$extends(withAccelerate());

	const id = ctx.req.param("id");

	try {
		// Find the user
		const user = await prisma.user.findUnique({
			where: {
				id: id,
			},
			select: {
				id: true,
				name: true,
				email: true,
				bio: true,
				about: true,
				profileImg: true,
				posts: {
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
								name: true,
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
			ctx.status(404);
			return ctx.json({ error: "User not exist!" });
		}

		// Transform topics to an array of strings
		const transformedUser = {
			...user,
			posts: user?.posts.map((post) => ({
				...post,
				topics: post.topics.map((topic) => topic.topic),
			})),
		};

		return ctx.json(transformedUser);
	} catch (err) {
		ctx.status(500);
		return ctx.json({ error: "Error fetching user" });
	}
};

// update user profile
export const updateUser = async (ctx: Context) => {
	const prisma = new PrismaClient({
		datasourceUrl: ctx.env?.DATABASE_URL,
	}).$extends(withAccelerate());

	const user: userType = ctx.get("user");

	try {
		// Parse form data
		const formData = await ctx.req.formData();

		const body = {
			name: formData.get("name") as string,
			bio: formData.get("bio") as string,
			profileImg: formData.get("profileImg") as File,
		};

		// Check if the name has been changed and if, Check for new name already exists in the database
		if (body.name !== user.name) {
			const existingUser = await prisma.user.findUnique({
				where: {
					name: body.name,
				},
			});

			if (existingUser) {
				return ctx.json({ error: "Name already exists. Please choose a different name." });
			}
		}

		// add new image link if added else set old url
		const existingPost = await prisma.user.findUnique({
			where: {
				id: user.id,
			},
			select: {
				profileImg: true,
			},
		});
		const currentProfileImg = existingPost?.profileImg;
		const secure_url = body.profileImg ? await uploadImageCloudinary(body.profileImg) : currentProfileImg;

		// update post
		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				name: body.name,
				bio: body.bio,
				profileImg: secure_url,
			},
		});

		return ctx.json({ message: "User updated successfully" });
	} catch (err) {
		ctx.status(500);
		return ctx.json({ error: "Error updating user" });
	}
};
