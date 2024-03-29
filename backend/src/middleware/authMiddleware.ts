import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context, Next } from "hono";
import { verify } from "hono/jwt";

export const authMiddleware = async function (ctx: Context, next: Next) {
	const prisma = new PrismaClient({
		datasourceUrl: ctx.env?.DATABASE_URL,
	}).$extends(withAccelerate());

	const token = ctx.req.header("Authorization");

	if (!token) {
		ctx.status(401);
		return ctx.json({ message: "signin first" });
	}

	try {
		const decodedPaylod = await verify(token, ctx.env.JWT_SECRET);
		const userId = decodedPaylod.id;

		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		});

		ctx.set("user", user);

		await next();
	} catch (e) {
		ctx.status(403);
		console.log(e);
		return ctx.json({ error: "error while user validation" });
	}
};
