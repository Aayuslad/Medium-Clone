import { Context } from "hono";
import { sign } from "hono/jwt";
import { signUpSchema, signinSchema } from "@aayushlad/medium-clone-common";

export const signup = async function (ctx: Context) {
	const prisma = ctx.get("prisma");

	const body = await ctx.req.json();

	const { success } = signUpSchema.safeParse(body);
	if (!success) {
		ctx.status(400);
		return ctx.json({ error : "Invalid request parameters" });
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

		return ctx.json({ jwt });
	} catch (e) {
		ctx.status(403);
		console.log(e);
		return ctx.json({ error: "error while signing up" });
	}
};

export const signin = async function (ctx: Context) {
	const prisma = ctx.get("prisma");

	const body = await ctx.req.json();

	const { success } = signinSchema.safeParse(body);
	if (!success) {
		ctx.status(400);
		return ctx.json({ error: "Invalid request parameters" });
	}

	try {
		const user = await prisma.user.findUnique({
			where: {
				email: body.email,
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

		return ctx.json({ jwt });
	} catch (e) {
		ctx.status(403);
		console.log(e);
		return ctx.json({ error: "error while signing in" });
	}
};
