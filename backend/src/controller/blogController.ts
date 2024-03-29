import { Context } from "hono";
import { createBlogSchemas, updateBlogSchema } from "@aayushlad/medium-clone-common"

// get a unique blog by id
export const getBlog = async function (ctx: Context) {
	const prisma = ctx.get("prisma");

	const id = ctx.req.param("id");
	try {
		const blog = await prisma.post.findUnique({
			where: {
				id: id,
			}
		});

		return ctx.json({ blog });
	} catch (error) {
		ctx.status(400);
		console.log("error fetching blog", error);
		return ctx.json({ error: "Error fetching blog" });
	}
};

// get all blogs
export const getAllBlogs = async function (ctx: Context) {
	const prisma = ctx.get("prisma");

	try {
		const blogs = await prisma.post.findMany();
		return ctx.json({ blogs });
	} catch (error) {
		ctx.status(400);
		console.log("error fetching blogs", error);
		return ctx.json({ error: "Error fetching blogs" });	
	}
};

// create a new blog
export const createBlog = async function (ctx: Context) {
	const prisma = ctx.get("prisma");

	const user = ctx.get("user");
	const body = await ctx.req.json();

	const { success } = createBlogSchemas.safeParse(body);
	if (!success) {
		ctx.status(400);
		return ctx.json({ error: "Invalid request parameters" });
	}

	try {
		const newBlog = await prisma.post.create({
			data: {
				title: body.title,
				content: body.content,
				authorId: user.id,
			},
		});

		console.log("new blog", newBlog);

		ctx.status(201);
		return ctx.json({ message: "Blog created successfully" });
	} catch (error) {
		ctx.status(400);
		console.log("error creating blog", error);
		return ctx.json({ error: "Error creating blog" });
	}
};

// update an existing blog
export const updateBlog = async function (ctx: Context) {
	const prisma = ctx.get("prisma");

	const user = ctx.get("user");
	const body = await ctx.req.json();

	const { success } = updateBlogSchema.safeParse(body);
	if (!success) {
		ctx.status(400);
		return ctx.json({ error: "Invalid request parameters" });
	}

	try {
		const newBlog = await prisma.post.update({
			where: {
				id: body.id,
				authorId: user.id,
			},
			data: {
				title: body.title,
				content: body.content,
			},
		});

		console.log("updated blog", newBlog);

		ctx.status(201);
		return ctx.json({ message: "Blog updated successfully" });
	} catch (error) {
		ctx.status(400);
		console.log("error updating blog", error);
		return ctx.json({ error: "Error updating blog" });
	}
};

// delete a blog
export const deleteBlog = async function (ctx: Context) {
	const prisma = ctx.get("prisma");

	const user = ctx.get("user");
	const id = ctx.req.param("id");

	try {
		const newBlog = await prisma.post.delete({
			where: {
				id: id,
				authorId: user.id,
			}
		})

		console.log("deleted blog", newBlog);

		ctx.status(201);
		return ctx.json({ message: "Blog deleted successfully" });
	} catch (error) {
		ctx.status(400);
		console.log("error deleting blog", error);
		return ctx.json({ error: "Error deleting blog" });
	}
};
