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
export declare const signUpUserSchema: zod.ZodObject<{
    userName: zod.ZodString;
    email: zod.ZodString;
    password: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    userName: string;
    email: string;
    password: string;
}, {
    userName: string;
    email: string;
    password: string;
}>;
export type signUpUserSchemaType = zod.infer<typeof signUpUserSchema>;
export declare const signinUserSchema: zod.ZodObject<{
    emailOrName: zod.ZodString;
    password: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    password: string;
    emailOrName: string;
}, {
    password: string;
    emailOrName: string;
}>;
export type signinUserSchemaType = zod.infer<typeof signinUserSchema>;
export declare const updateUserSchema: zod.ZodObject<{
    userName: zod.ZodString;
    bio: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    userName: string;
    bio: string;
}, {
    userName: string;
    bio: string;
}>;
type updateUserSchemaIntermidiateType = zod.infer<typeof updateUserSchema>;
export type updateUserSchemaType = updateUserSchemaIntermidiateType & {
    profileImg?: File | string;
};
export declare const updateUserAboutSectionSchema: zod.ZodObject<{
    about: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    about: string;
}, {
    about: string;
}>;
export type updateUserAboutSectionSchemaType = zod.infer<typeof updateUserAboutSectionSchema>;
export declare const followUserSchema: zod.ZodObject<{
    userIdToFollow: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    userIdToFollow: string;
}, {
    userIdToFollow: string;
}>;
export type followUserSchemaType = zod.infer<typeof followUserSchema>;
export declare const createStorySchema: zod.ZodObject<{
    title: zod.ZodString;
    content: zod.ZodString;
    description: zod.ZodString;
    published: zod.ZodBoolean;
    topics: zod.ZodArray<zod.ZodString, "many">;
}, "strip", zod.ZodTypeAny, {
    title: string;
    content: string;
    description: string;
    published: boolean;
    topics: string[];
}, {
    title: string;
    content: string;
    description: string;
    published: boolean;
    topics: string[];
}>;
type createStorySchemaIntermidiateType = zod.infer<typeof createStorySchema>;
export type createStorySchemaType = createStorySchemaIntermidiateType & {
    coverImg?: File;
};
export declare const updateStorySchema: zod.ZodObject<{
    title: zod.ZodString;
    content: zod.ZodString;
    description: zod.ZodString;
    published: zod.ZodBoolean;
    topics: zod.ZodArray<zod.ZodString, "many">;
    id: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    title: string;
    content: string;
    description: string;
    published: boolean;
    topics: string[];
    id: string;
}, {
    title: string;
    content: string;
    description: string;
    published: boolean;
    topics: string[];
    id: string;
}>;
type updateStorySchemaIntermidiateType = zod.infer<typeof updateStorySchema>;
export type updateStorySchemaType = updateStorySchemaIntermidiateType & {
    coverImg?: File | string;
};
export declare const clapStorySchema: zod.ZodObject<{
    storyId: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    storyId: string;
}, {
    storyId: string;
}>;
export type clapStorySchemaType = zod.infer<typeof clapStorySchema>;
export declare const followTopicSchema: zod.ZodObject<{
    topicId: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    topicId: string;
}, {
    topicId: string;
}>;
export type followTopicSchemaType = zod.infer<typeof followTopicSchema>;
export {};
