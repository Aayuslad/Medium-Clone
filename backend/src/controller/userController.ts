import {
	signUpSchema,
	signUpSchemaType,
	signinSchema,
	signinSchemaType,
} from "@aayushlad/medium-clone-common";
import { Context } from "hono";
import { setCookie } from "hono/cookie";
import { sign } from "hono/jwt";

export const signup = async function (ctx: Context) {
	const prisma = ctx.get("prisma");

	const body: signUpSchemaType = await ctx.req.json();

	console.log(body);
	

	const { success } = signUpSchema.safeParse(body);
	if (!success) {
		ctx.status(400);
		return ctx.json({ error: "Invalid request parameters" });
	}

	try {
		const repeatUser = await prisma.user.findUnique({
			where: {
				email: body.email,
			},
		});

		if (repeatUser) {
			ctx.status(400);
			return ctx.json({ error: "user alredy exist with this email" });
		}

		const user = await prisma.user.create({
			data: {
				email: body.email,
				password: body.password,
				name: body.name,
			},
		});

		const jwt = await sign({ id: user.id }, ctx.env.JWT_SECRET);

		setCookie(ctx, "Authorisation", jwt, {
			httpOnly: true,
			secure: true,
			sameSite: "None",
		});

		return ctx.json({ jwt });
	} catch (e) {
		ctx.status(403);
		console.log(e);
		return ctx.json({ error: "error while signing up" });
	}
};

export const signin = async function (ctx: Context) {
	const prisma = ctx.get("prisma");

	const body: signinSchemaType = await ctx.req.json();

	const { success } = signinSchema.safeParse(body);

	if (!success) {
		ctx.status(400);
		return ctx.json({ error: "Invalid request parameters" });
	}

	try {
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
			return ctx.json({ error: "user does not exist" });
		}

		if (user.password !== body.password) {
			ctx.status(400);
			return ctx.json({ error: "incorrect password" });
		}

		const jwt = await sign({ id: user.id }, ctx.env.JWT_SECRET);

		setCookie(ctx, "Authorisation", jwt, {
			httpOnly: true,
			secure: true,
			sameSite: "None",
		});

		return ctx.json({ jwt });
	} catch (e) {
		ctx.status(403);
		console.log(e);
		return ctx.json({ error: "error while signing in" });
	}
};

// get user data
export const getUser = async function (ctx: Context) {
	const prisma = ctx.get("prisma");
	const user = ctx.get("user");

	try {
		const userData = await prisma.user.findUnique({
			where: {
				id: user.id,
			},
		});

		if (!userData) {
			ctx.status(404);
			return ctx.json({ error: "User not found" });
		}

		// Remove the password field from the user data
		const { password, ...userDataWithoutPassword } = userData;

		return ctx.json(userDataWithoutPassword);
	} catch (e) {
		ctx.status(500);
		return ctx.json({ error: "Error fetching user" });
	}
};