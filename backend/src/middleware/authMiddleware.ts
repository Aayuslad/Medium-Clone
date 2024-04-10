import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

export const authMiddleware = async function (ctx: Context, next: Next) {
	// Instantiate Prisma client
	const prisma = new PrismaClient({
		datasourceUrl: ctx.env?.DATABASE_URL,
	}).$extends(withAccelerate());

	// Get auth token from cookies
	const token = getCookie(ctx, "Authorisation");

	// Check if user has a token
	if (!token) {
		ctx.status(401);
		return ctx.json({ message: "signin first" });
	}

	try {
		// Verify JWT token
		const decodedPaylod = await verify(token, ctx.env.JWT_SECRET);
		const userId = decodedPaylod.id;

		// Find user and attach to context
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
		ctx.set("user", user);

		await next();
	} catch (e) {
		// Handle error
		ctx.status(403);
		console.log(e);
		return ctx.json({ error: "error while user validation" });
	}
};
