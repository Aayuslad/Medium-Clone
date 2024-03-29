import zod from 'zod';

export const signUpSchema = zod.object({
	email: zod.string().email("Invalid email"),
	password: zod.string().min(6, "Password must be at least 6 chars"),
});

export type signUpSchemaType = zod.infer<typeof signUpSchema>;

export const signinSchema = zod.object({
	email: zod.string().email("Invalid email"),
	password: zod.string().min(6, "Password must be at least 6 chars"),
});

export type signinSchemaType = zod.infer<typeof signinSchema>;

export const createBlogSchemas = zod.object({
	title: zod.string().min(1),
	content: zod.string(),
});

export type createBlogSchemaType = zod.infer<typeof createBlogSchemas>;

export const updateBlogSchema = zod.object({
	id: zod.string(),
	title: zod.string(),
	contet: zod.string(),
});

export type updateBlogSchemaType = zod.infer<typeof updateBlogSchema>;
