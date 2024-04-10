import axios from "axios";
import { create } from "zustand";
import toast from "react-hot-toast";
import { BlogType } from "@aayushlad/medium-clone-common";

type BlogStoreType = {
	cursorLoading: boolean;
	skelitonLoading: boolean;
	savingPostLoading: Boolean | undefined;
	feedBlogs: BlogType[] | [];
	postBlog: (value: FormData) => Promise<string>;
	putBlog: (value: FormData) => Promise<Boolean>;
	getBlog: (value: { id: string }) => Promise<BlogType | undefined>;
	getBlogs: () => void;
	deleteBlog: (value: { id: string }) => void;
	clapBlog: (value: { postId: string }) => void;
};

export const BlogStore = create<BlogStoreType>((set) => ({
	cursorLoading: false,
	skelitonLoading: false,
	savingPostLoading: undefined,
	feedBlogs: [],

	postBlog: async (values) => {
		let id: string = "";

		try {
			set({ cursorLoading: true });
			const res = await axios.post("/api/v1/blog", values);
			console.log(res);

			id = res.data.newBlog.id;
		} catch (error) {
			toast.error("Error while creating Blog!");
		} finally {
			set({ cursorLoading: false });
			return id;
		}
	},

	putBlog: async (values) => {
		let flag: Boolean = false;

		try {
			set({ savingPostLoading: true });
			await axios.put("/api/v1/blog", values);
			flag = true;
		} catch (error) {
			toast.error("Error while updating Blog!");
		} finally {
			set({ savingPostLoading: false });
			return flag;
		}
	},

	getBlog: async (values) => {
		let blog: BlogType | undefined = undefined;

		try {
			set({ skelitonLoading: true });
			const res = await axios.get(`/api/v1/blog/${values.id}`);
			blog = res.data;
		} catch (error) {
			toast.error("Error while fetching Blog!");
		} finally {
			set({ skelitonLoading: false });
			return blog;
		}
	},

	getBlogs: async () => {
		try {
			set({ skelitonLoading: true });
			const res = await axios.get(`/api/v1/blog/bulk`);
			set({ feedBlogs: res.data });
		} catch (error) {
			toast.error("Error while fetching Blog!");
		} finally {
			set({ skelitonLoading: false });
		}
	},

	deleteBlog: async (values) => {
		try {
			await axios.delete(`/api/v1/blog/${values.id}`);
		} catch (error) {
		} finally {
			return;
		}
	},

	clapBlog: async (values) => {
		try {
			set({ savingPostLoading: true })
			await axios.post(`/api/v1/blog/clap`, values);
		} catch (error: any) {
			console.log(error);
			if (error.response.status == 401) {
				toast.error("Signin To clap")
			} 
		} finally {
			set({ savingPostLoading: false })
		}
	},
}));
