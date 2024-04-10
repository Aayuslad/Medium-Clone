import zod from "zod";

export const fileSchema = zod.union([
	zod.string(),
	zod.object({
		lastModified: zod.number(),
		name: zod.string(),
		type: zod.string(),
		size: zod.number(),
	}),
]);

export type userType = {
	id: string;
	email: string;
	name: string;
	password?: string;
	bio?: string;
	about?: string;
	posts?: BlogType[];
	profileImg?: string | File;
};

export type BlogType = {
	id?: string;
	title: string;
	content?: string;
	description: string;
	published?: boolean;
	postedOn?: string;
	totalClaps?: number;
	topics: string[];
	author?: {
		id: string;
		name: string;
		bio: string;
		profileImg: string;
	};
	claps?: {
		id: string;
		profileImg: string;
		name: string;
		bio: string;
	}[];
	coverImage: string | File;
};

export const signUpSchema = zod.object({
	name: zod.string().regex(/^\S*$/), // cheking for space
	email: zod.string().email(),
	password: zod.string().min(6),
});

export type signUpSchemaType = zod.infer<typeof signUpSchema>;

export const signinSchema = zod.object({
	emailOrName: zod.string(),
	password: zod.string().min(6),
});

export type signinSchemaType = zod.infer<typeof signinSchema>;

export const createBlogSchemas = zod.object({
	title: zod.string(),
	content: zod.string(),
	description: zod.string(),
	published: zod.boolean(),
	topics: zod.array(zod.string()),
	coverImage: fileSchema,
});

export type createBlogSchemaType = zod.infer<typeof createBlogSchemas>;

export const updateBlogSchema = zod.object({
	id: zod.string(),
	title: zod.string(),
	content: zod.string(),
	description: zod.string(),
	published: zod.boolean(),
	topics: zod.array(zod.string()),
	coverImage: fileSchema,
});

export type updateBlogSchemaType = zod.infer<typeof updateBlogSchema>;

export const updateUserSchema = zod.object({
	name: zod.string(),
	bio: zod.string(),
	profileImg: fileSchema,
});

export type updateUserSchemaType = zod.infer<typeof updateUserSchema>;

export const updateUserAboutSchema = zod.object({
	about: zod.string(),
});

export type updateUserAboutSchemaType = zod.infer<typeof updateUserAboutSchema>;

export const clapBlogSchema = zod.object({
	postId: zod.string(),
});

export type clapBlogSchemaType = zod.infer<typeof clapBlogSchema>;