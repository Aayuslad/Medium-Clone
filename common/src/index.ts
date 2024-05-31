import zod from "zod";

export type userType = {
	id: string;
	userName: string;
	email: string;
	bio: string;
	about: string;
	profileImg: string;
	followersCount?: number;
	followingCount?: number;
	savedStories?: string[];
	claps?: string[];
	following?: string[];
	followedTopics: {
		topic: string;
		id: string;
	}[];
	topFiveFollowing?: {
		id: string;
		profileImg: string;
		userName: string;
		bio: string;
	}[];
	stories?: storyType[];
};

export type storyType = {
	id: string;
	title: string;
	content?: string;
	description: string;
	postedOn: string;
	published?: boolean;
	clapsCount?: number;
	responseCount?: number;
	coverImg: string;
	topics: string[];
	author: {
		id: string;
		userName: string;
		bio?: string;
		profileImg: string;
		followersCount: number;
	};
};

export type topicType = {
	id: string;
	topic: string;
	followersCount: number;
	storiesCount: number;
};

export type responseType = {
	user: {
		id: string;
		userName: string;
		profileImg: string;
	};
	id: string;
	content: string;
	postedAt: string;
	replyCount?: number;
};

//
export const signUpUserSchema = zod.object({
	userName: zod.string().regex(/^\S*$/),
	email: zod.string().email(),
	password: zod.string().min(6),
});

export type signUpUserSchemaType = zod.infer<typeof signUpUserSchema>;

//
export const signinUserSchema = zod.object({
	emailOrName: zod.string(),
	password: zod.string().min(6),
});

export type signinUserSchemaType = zod.infer<typeof signinUserSchema>;

//
export const updateUserSchema = zod.object({
	userName: zod.string().regex(/^\S*$/),
	bio: zod.string(),
});

type updateUserSchemaIntermidiateType = zod.infer<typeof updateUserSchema>;
export type updateUserSchemaType = updateUserSchemaIntermidiateType & {
	profileImg?: File | string;
};

//
export const updateUserAboutSectionSchema = zod.object({
	about: zod.string(),
});

export type updateUserAboutSectionSchemaType = zod.infer<typeof updateUserAboutSectionSchema>;

//
export const followUserSchema = zod.object({
	userIdToFollow: zod.string(),
});

export type followUserSchemaType = zod.infer<typeof followUserSchema>;

//
export const createStorySchema = zod.object({
	title: zod.string(),
	content: zod.string(),
	description: zod.string(),
	published: zod.boolean(),
	topics: zod.array(zod.string()),
});

type createStorySchemaIntermidiateType = zod.infer<typeof createStorySchema>;
export type createStorySchemaType = createStorySchemaIntermidiateType & {
	coverImg?: File;
};

//
export const updateStorySchema = createStorySchema.merge(
	zod.object({
		id: zod.string(),
	}),
);

type updateStorySchemaIntermidiateType = zod.infer<typeof updateStorySchema>;
export type updateStorySchemaType = updateStorySchemaIntermidiateType & {
	coverImg?: File | string;
};

//
export const clapStorySchema = zod.object({
	storyId: zod.string(),
});

export type clapStorySchemaType = zod.infer<typeof clapStorySchema>;

//
export const followTopicSchema = zod.object({
	topicId: zod.string(),
});

export type followTopicSchemaType = zod.infer<typeof followTopicSchema>;

//
export const makeResponseSchema = zod.object({
	content: zod.string().max(500),
	storyId: zod.string(),
});

export type makeResponseSchemaType = zod.infer<typeof makeResponseSchema>;

//
export const makeReplyToResponseSchema = zod.object({
	content: zod.string(),
	responseId: zod.string(),
});

export type makeReplyToResponseSchemaType = zod.infer<typeof makeReplyToResponseSchema>;

//
export const editResponseSchema = zod.object({
	responseId: zod.string(),
	content: zod.string(),
});

export type editResponseSchemaType = zod.infer<typeof editResponseSchema>;

//
export const editReplySchema = zod.object({
	responseId: zod.string(),
	content: zod.string(),
});

export type editReplySchemaType = zod.infer<typeof editReplySchema>;