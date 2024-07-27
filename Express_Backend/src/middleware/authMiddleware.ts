import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
const JWT_SECRET: string | undefined = process.env.JWT_SECRET;
import { prisma } from "../db/prismaClient";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const token: string | undefined = req.cookies?.Authorization;
	let topics: { topic: string; id: string }[] = [];

	try {
		topics = await prisma.topics.findMany({
			take: 10,
			orderBy: {
				storiesCount: "desc",
			},
			select: {
				topic: true,
				id: true,
			},
		});
	} catch (error) {
		console.log("error fetching topics");
	}

	if (!token) {
		res.status(401).json({ message: "Sign in to get a better experience", topics });
		return;
	}

	try {
		// Verify JWT token
		const decodedPayload: string | JwtPayload = jwt.verify(token, JWT_SECRET || "");
		if (typeof decodedPayload === "string") {
			res.status(403).json({ message: "Authentication failed. Please log in again.", topics });
			return;
		}
		const userId: string = decodedPayload.id;

		// Find user and attach to request
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
		req.user = user;

		next();
	} catch (e) {
		console.error(e);
		return res.status(403).json({ message: "Authentication failed. Please log in again.", topics });
	}
};

export default authMiddleware;
