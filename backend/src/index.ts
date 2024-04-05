import { Context, Hono, Next } from "hono";
import { cors } from "hono/cors";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
// routers
import userRouter from "./routes/userRouter";
import blogRouter from "./routes/blogRouter";

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

app.use(
	cors({
		origin: ["http://localhost:5173"],
		allowMethods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	}),
);


app.use("*", async (ctx: Context, next: Next) => {
  const prisma = new PrismaClient({
    datasourceUrl: ctx.env?.DATABASE_URL, 
  }).$extends(withAccelerate());
  ctx.set("prisma", prisma);
  await next();
});
app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

export default app;
