import zod from "zod";
export declare const fileSchema: zod.ZodUnion<[zod.ZodString, zod.ZodObject<{
    lastModified: zod.ZodNumber;
    name: zod.ZodString;
    type: zod.ZodString;
    size: zod.ZodNumber;
}, "strip", zod.ZodTypeAny, {
    type: string;
    lastModified: number;
    name: string;
    size: number;
}, {
    type: string;
    lastModified: number;
    name: string;
    size: number;
}>]>;
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
    coverImage: zod.ZodUnion<[zod.ZodString, zod.ZodObject<{
        lastModified: zod.ZodNumber;
        name: zod.ZodString;
        type: zod.ZodString;
        size: zod.ZodNumber;
    }, "strip", zod.ZodTypeAny, {
        type: string;
        lastModified: number;
        name: string;
        size: number;
    }, {
        type: string;
        lastModified: number;
        name: string;
        size: number;
    }>]>;
}, "strip", zod.ZodTypeAny, {
    title: string;
    content: string;
    description: string;
    published: boolean;
    topics: string[];
    coverImage: (string | {
        type: string;
        lastModified: number;
        name: string;
        size: number;
    }) & (string | {
        type: string;
        lastModified: number;
        name: string;
        size: number;
    } | undefined);
}, {
    title: string;
    content: string;
    description: string;
    published: boolean;
    topics: string[];
    coverImage: (string | {
        type: string;
        lastModified: number;
        name: string;
        size: number;
    }) & (string | {
        type: string;
        lastModified: number;
        name: string;
        size: number;
    } | undefined);
}>;
export type createBlogSchemaType = zod.infer<typeof createBlogSchemas>;
export declare const updateBlogSchema: zod.ZodObject<{
    id: zod.ZodString;
    title: zod.ZodString;
    content: zod.ZodString;
    description: zod.ZodString;
    published: zod.ZodBoolean;
    topics: zod.ZodArray<zod.ZodString, "many">;
    coverImage: zod.ZodUnion<[zod.ZodString, zod.ZodObject<{
        lastModified: zod.ZodNumber;
        name: zod.ZodString;
        type: zod.ZodString;
        size: zod.ZodNumber;
    }, "strip", zod.ZodTypeAny, {
        type: string;
        lastModified: number;
        name: string;
        size: number;
    }, {
        type: string;
        lastModified: number;
        name: string;
        size: number;
    }>]>;
}, "strip", zod.ZodTypeAny, {
    title: string;
    content: string;
    description: string;
    published: boolean;
    topics: string[];
    coverImage: (string | {
        type: string;
        lastModified: number;
        name: string;
        size: number;
    }) & (string | {
        type: string;
        lastModified: number;
        name: string;
        size: number;
    } | undefined);
    id: string;
}, {
    title: string;
    content: string;
    description: string;
    published: boolean;
    topics: string[];
    coverImage: (string | {
        type: string;
        lastModified: number;
        name: string;
        size: number;
    }) & (string | {
        type: string;
        lastModified: number;
        name: string;
        size: number;
    } | undefined);
    id: string;
}>;
export type updateBlogSchemaType = zod.infer<typeof updateBlogSchema>;
export declare const updateUserSchema: zod.ZodObject<{
    name: zod.ZodString;
    bio: zod.ZodString;
    profileImg: zod.ZodUnion<[zod.ZodString, zod.ZodObject<{
        lastModified: zod.ZodNumber;
        name: zod.ZodString;
        type: zod.ZodString;
        size: zod.ZodNumber;
    }, "strip", zod.ZodTypeAny, {
        type: string;
        lastModified: number;
        name: string;
        size: number;
    }, {
        type: string;
        lastModified: number;
        name: string;
        size: number;
    }>]>;
}, "strip", zod.ZodTypeAny, {
    name: string;
    bio: string;
    profileImg: (string | {
        type: string;
        lastModified: number;
        name: string;
        size: number;
    }) & (string | {
        type: string;
        lastModified: number;
        name: string;
        size: number;
    } | undefined);
}, {
    name: string;
    bio: string;
    profileImg: (string | {
        type: string;
        lastModified: number;
        name: string;
        size: number;
    }) & (string | {
        type: string;
        lastModified: number;
        name: string;
        size: number;
    } | undefined);
}>;
export type updateUserSchemaType = zod.infer<typeof updateUserSchema>;
export declare const updateUserAboutSchema: zod.ZodObject<{
    about: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    about: string;
}, {
    about: string;
}>;
export type updateUserAboutSchemaType = zod.infer<typeof updateUserAboutSchema>;
export declare const clapBlogSchema: zod.ZodObject<{
    postId: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    postId: string;
}, {
    postId: string;
}>;
export type clapBlogSchemaType = zod.infer<typeof clapBlogSchema>;
