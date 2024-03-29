import { Context, Hono, Next } from "hono";
// middlewares
import { authMiddleware } from "./middleware/authMiddleware";
// routers
import userRouter from "./routes/userRouter";
import blogRouter from "./routes/blogRouter";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

// Create the main Hono app
const app = new Hono<{
	Bindings: {
		DATABASE_URL: string;
		JWT_SECRET: string;
	};
	Variables: {
		user: {
			email: string;
			id: string;
			name: string | null;
			password: string;
		} | null;
		prisma: any;
	};
}>();

app.use("*", async (ctx: Context, next: Next) => {
  const prisma = new PrismaClient({
    datasourceUrl: ctx.env?.DATABASE_URL, 
  }).$extends(withAccelerate());
  ctx.set("prisma", prisma);
  await next();
});
app.route("/api/v1/user", userRouter);
app.use("/api/v1/blog/*", authMiddleware);
app.route("/api/v1/blog", blogRouter);

export default app;
