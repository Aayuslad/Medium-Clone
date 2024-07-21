import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

export const prisma = new PrismaClient({
	datasources: {
		db: {
			url: process.env.DATABASE_URL || "",
		},
	},
}).$extends(withAccelerate());

prisma.$connect()
	.then(() => console.log('Database connected successfully'))
	.catch((error) => console.error('Failed to connect to database:', error));
