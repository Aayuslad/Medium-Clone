import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import userRouter from "./router/userRouter";
import storyRouter from "./router/storyRouter";
import rateLimit from "express-rate-limit";

const app = express();

const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

app.use(
	cors({
		origin: ["http://localhost:5173", "https://medium-clone-jz8b.vercel.app"],
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	}),
);

app.get("/", (req, res) => {
	res.json({ message: "welcome 😊, I am Aayush" });
});

app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
	res.json({ message: " server startted " });
});
app.use("/api/v1/user", userRouter);
app.use("/api/v1/story", storyRouter);

const PORT = process.env.PORT || 80;

app.listen(PORT, () => console.log("server started"));
