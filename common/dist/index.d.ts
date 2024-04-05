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
export declare const signUpSchema: zod.ZodObject<{
    name: zod.ZodString;
    email: zod.ZodString;
    password: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
}, {
    name: string;
    email: string;
    password: string;
}>;
export type signUpSchemaType = zod.infer<typeof signUpSchema>;
export declare const signinSchema: zod.ZodObject<{
    emailOrName: zod.ZodString;
    password: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    password: string;
    emailOrName: string;
}, {
    password: string;
    emailOrName: string;
}>;
export type signinSchemaType = zod.infer<typeof signinSchema>;
export declare const createBlogSchemas: zod.ZodObject<{
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
export type createBlogSchemaType = zod.infer<typeof createBlogSchemas>;
export declare const updateBlogSchema: zod.ZodObject<{
    id: zod.ZodString;
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
    id: string;
}, {
    title: string;
    content: string;
    description: string;
    published: boolean;
    topics: string[];
    id: string;
}>;
export type updateBlogSchemaType = zod.infer<typeof updateBlogSchema>;
