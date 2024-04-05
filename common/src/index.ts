import zod from "zod";

export type UserType = {
	id: string;
	email: string;
	name: string;
	password?: string;
};

export type BlogType = {
	id: string;
	title?: string;
	content?: string;
	description?: string;
	coverImage?: string;
	published: boolean;
	authorId?: string;
	topics?: string[];
};

export const signUpSchema = zod.object({
	name: zod.string().regex(/^\S*$/, "Name should not contain spaces"),
	email: zod.string().email("Invalid email"),
	password: zod.string().min(6, "Password must be at least 6 chars"),
});

export type signUpSchemaType = zod.infer<typeof signUpSchema>;

export const signinSchema = zod.object({
	emailOrName: zod.string(),
	password: zod.string().min(6, "Password must be at least 6 chars"),
});

export type signinSchemaType = zod.infer<typeof signinSchema>;

export const createBlogSchemas = zod.object({
	title: zod.string(),
	content: zod.string(),
	description: zod.string(),
	published: zod.boolean(),
	topics: zod.array(zod.string()),
});

export type createBlogSchemaType = zod.infer<typeof createBlogSchemas>;

export const updateBlogSchema = zod.object({
	id: zod.string(),
	title: zod.string(),
	content: zod.string(),
	description: zod.string(),
	published: zod.boolean(),
	topics: zod.array(zod.string()),
});

export type updateBlogSchemaType = zod.infer<typeof updateBlogSchema>;
