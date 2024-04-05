import { Hono } from "hono";
import { cors } from "hono/cors";
// routers
import blogRouter from "./routes/blogRouter";
import userRouter from "./routes/userRouter";

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
		origin: ["http://localhost:5173", "https://medium-clone-two-psi.vercel.app"],
		allowMethods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	}),
);

app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

export default app;
