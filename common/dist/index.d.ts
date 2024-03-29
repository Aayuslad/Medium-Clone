import zod from 'zod';
export declare const signUpSchema: zod.ZodObject<{
    email: zod.ZodString;
    password: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type signUpSchemaType = zod.infer<typeof signUpSchema>;
export declare const signinSchema: zod.ZodObject<{
    email: zod.ZodString;
    password: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type signinSchemaType = zod.infer<typeof signinSchema>;
export declare const createBlogSchemas: zod.ZodObject<{
    title: zod.ZodString;
    content: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    title: string;
    content: string;
}, {
    title: string;
    content: string;
}>;
export type createBlogSchemaType = zod.infer<typeof createBlogSchemas>;
export declare const updateBlogSchema: zod.ZodObject<{
    id: zod.ZodString;
    title: zod.ZodString;
    contet: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    title: string;
    id: string;
    contet: string;
}, {
    title: string;
    id: string;
    contet: string;
}>;
export type updateBlogSchemaType = zod.infer<typeof updateBlogSchema>;
