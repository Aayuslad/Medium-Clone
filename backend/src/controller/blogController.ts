import { createBlogSchemas, updateBlogSchema } from "@aayushlad/medium-clone-common";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Topics } from "@prisma/client";
import { Context } from "hono";
import { uploadImageCloudinary } from "../utils/cloudinary";

type userType = {
	id: string;
	email: string;
	name: string;
	password: string;
} | null;

// get a unique blog by id
export const getBlog = async function (ctx: Context) {
	const prisma = new PrismaClient({
		datasourceUrl: ctx.env?.DATABASE_URL,
	}).$extends(withAccelerate());

	const id = ctx.req.param("id");
	try {
		const blog = await prisma.post.findUnique({
			where: {
				id: id,
			},
			select: {
				id: true,
				title: true,
				content: true,
				description: true,
				postedOn: true,
				topics: {
					select: {
						topic: true,
					},
				},
				coverImage: true,
				author: {
					select: {
						name: true,
					},
				},
			},
		});

		// Transform topics to an array of strings
		const transformedBlog = {
			...blog,
			topics: blog?.topics.map((topicObj: { topic: string }) => topicObj.topic),
			author: blog?.author.name,
		};

		return ctx.json(transformedBlog);
	} catch (error) {
		ctx.status(400);
		console.log("error fetching blog", error);
		return ctx.json({ error: "Error fetching blog" });
	}
};

// get all blogs
export const getAllBlogs = async function (ctx: Context) {
	const prisma = new PrismaClient({
		datasourceUrl: ctx.env?.DATABASE_URL,
	}).$extends(withAccelerate());

	try {
		const blogs = await prisma.post.findMany({
			select: {
				id: true,
				title: true,
				description: true,
				postedOn: true,
				topics: {
					select: {
						topic: true,
					},
				},
				coverImage: true,
				author: {
					select: {
						name: true,
					},
				},
			},
		});

		// Map over blogs to transform topics to an array of strings
		const transformedBlogs = blogs.map(
			(blog: { topics: { topic: string }[]; author: { name: string } }) => ({
				...blog,
				topics: blog.topics.map((topicObj) => topicObj.topic),
				author: blog.author.name,
			}),
		);

		return ctx.json(transformedBlogs);
	} catch (error) {
		ctx.status(400);
		console.log("error fetching blogs", error);
		return ctx.json({ error: "Error fetching blogs" });
	}
};

// careate a new blog
export const createBlog = async function (ctx: Context) {
	const prisma = new PrismaClient({
		datasourceUrl: ctx.env?.DATABASE_URL,
	}).$extends(withAccelerate());

	const user: userType = ctx.get("user");

	try {
		// Parse form data
		const formData = await ctx.req.formData();

		console.log(formData);

		// Parse topics as JSON array
		const topicsString = formData.get("topics") as string;
		const topics: string[] = topicsString.split(",");

		// Construct the body object from form data
		const body = {
			title: formData.get("title") as string,
			content: formData.get("content") as string,
			description: formData.get("description") as string,
			published: formData.get("published") === "true", // Convert to boolean
			topics: topics,
			coverImage: formData.get("coverImage") as File,
		};

		console.log(body);

		// Validate the body against the schema
		const { success } = createBlogSchemas.safeParse(body);
		if (!success) {
			ctx.status(400);
			return ctx.json({ error: "Invalid request parameters" });
		}

		// Prepare topic IDs to connect
		let topicIdsToAdd: string[] = [];
		if (body.topics && body.topics.length > 0) {
			// Check if topics already exist in the database
			for (const topic of body.topics) {
				if (topic == "") continue;

				const existingTopic = await prisma.topics.findFirst({
					where: {
						topic: topic,
					},
				});

				if (existingTopic) {
					// If topic already exists, get its ID
					topicIdsToAdd.push(existingTopic.id);
				} else {
					// If topic doesn't exist, create it and get its ID
					const newTopic = await prisma.topics.create({
						data: {
							topic: topic,
						},
					});
					topicIdsToAdd.push(newTopic.id);
				}
			}
		}

		// Upload cover image to Cloudinary and get secure URL
		const secure_url = body.coverImage ? await uploadImageCloudinary(body.coverImage) : "";

		// Create new blog post
		const newBlog = await prisma.post.create({
			data: {
				title: body.title,
				content: body.content,
				description: body.description,
				postedOn: new Date(),
				published: body.published,
				authorId: user?.id || "",
				coverImage: secure_url,
				topics: {
					connect: topicIdsToAdd.map((id) => ({ id: id })),
				},
			},
		});

		console.log(newBlog);

		// Return successful response
		ctx.status(201);
		return ctx.json({ newBlog });
	} catch (error) {
		// Handle errors
		ctx.status(400);
		console.log("error creating blog", error);
		return ctx.json({ error: "Error creating blog" });
	}
};

// update an existing blog
export const updateBlog = async function (ctx: Context) {
	const prisma = new PrismaClient({
		datasourceUrl: ctx.env?.DATABASE_URL,
	}).$extends(withAccelerate());

	const user: userType = ctx.get("user");

	try {
		// Parse form data
		const formData = await ctx.req.formData();

		// Parse topics as JSON array
		const topicsString = formData.get("topics") as string;
		const topics: string[] = topicsString.split(",");

		// Construct the body object from form data
		const body = {
			id: formData.get("id") as string,
			title: formData.get("title") as string,
			content: formData.get("content") as string,
			description: formData.get("description") as string,
			published: formData.get("published") === "true", // Convert to boolean
			topics: topics,
			coverImage: formData.get("coverImage") as File | null,
		};

		const { success } = updateBlogSchema.safeParse(body);
		if (!success) {
			ctx.status(400);
			return ctx.json({ error: "Invalid request parameters" });
		}

		let topicIdsToAdd: string[] = [];
		if (body.topics && body.topics.length > 0) {
			// Check if topics already exist in the database
			for (const topic of body.topics) {
				if (topic == "") continue;

				const existingTopic = await prisma.topics.findFirst({
					where: {
						topic: topic,
					},
				});

				if (existingTopic) {
					// If topic already exists, get its ID
					topicIdsToAdd.push(existingTopic.id);
				} else {
					// If topic doesn't exist, create it and get its ID
					const newTopic = await prisma.topics.create({
						data: {
							topic: topic,
						},
					});

					topicIdsToAdd.push(newTopic.id);
				}
			}
		}

		// Get the current topics associated with the post
		const currentPost = await prisma.post.findUnique({
			where: {
				id: body.id,
			},
			include: {
				topics: true,
			},
		});

		// Extract topic IDs of the current topics associated with the post
		const currentTopicIds: string[] = currentPost?.topics?.length
			? currentPost.topics.map((topic: Topics) => topic.id)
			: [];

		// Find the topic IDs to disconnect
		const topicIdsToDisconnect: string[] =
			currentTopicIds.length > 0 ? currentTopicIds?.filter((id) => !topicIdsToAdd.includes(id)) : [];

		// add new image link if added else set old url
		const existingPost = await prisma.post.findUnique({
			where: {
				id: body.id,
			},
		});
		const currentCoverImage = existingPost?.coverImage;
		const secure_url = body.coverImage ? await uploadImageCloudinary(body.coverImage) : currentCoverImage;

		// updating the blog
		await prisma.post.update({
			where: {
				id: body.id,
				authorId: user?.id,
			},
			data: {
				title: body.title,
				content: body.content,
				description: body.description,
				published: body.published,
				coverImage: secure_url,
				topics: {
					connect: topicIdsToAdd.length > 0 ? topicIdsToAdd.map((id) => ({ id: id })) : [], // Connect post with existing or newly created topics
					disconnect:
						topicIdsToDisconnect.length > 0 ? topicIdsToDisconnect.map((id) => ({ id: id })) : [], // Disconnect post from topics that are no longer associated
				},
			},
		});

		// Return successful response
		ctx.status(201);
		return ctx.json({ message: "Blog updated successfully" });
	} catch (error) {
		// Handle errors
		ctx.status(400);
		console.log("error updating blog", error);
		return ctx.json({ error: "Error updating blog" });
	}
};

// delete a blog
export const deleteBlog = async function (ctx: Context) {
	const prisma = new PrismaClient({
		datasourceUrl: ctx.env?.DATABASE_URL,
	}).$extends(withAccelerate());

	const user: userType = ctx.get("user");
	const id = ctx.req.param("id");

	try {
		const newBlog = await prisma.post.delete({
			where: {
				id: id,
				authorId: user?.id,
			},
		});

		console.log("deleted blog", newBlog);

		ctx.status(201);
		return ctx.json({ message: "Blog deleted successfully" });
	} catch (error) {
		ctx.status(400);
		console.log("error deleting blog", error);
		return ctx.json({ error: "Error deleting blog" });
	}
};
