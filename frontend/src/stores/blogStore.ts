import axios from "axios";
import { create } from "zustand";
import toast from "react-hot-toast";
import { BlogType } from "@aayushlad/medium-clone-common"

type BlogStoreType = {
	loading: boolean;
	cursorLoading: boolean;
	updatingPost: Boolean | undefined;
	feedBlogs: BlogType[] | [];
	postBlog: (value: FormData) => Promise<string>;
	putBlog: (value: FormData) => Promise<Boolean>;
	getBlog: (value: { id: string }) => Promise<BlogType | undefined>;
	getBlogs: () => void;
	deleteBlog: (value: { id: string }) => void;
};

export const blogStore = create<BlogStoreType>((set) => ({
	loading: false,
	cursorLoading: false,
	updatingPost: undefined,
	feedBlogs: [],

	postBlog: async (value) => {
		let id: string = "";

		try {
			set({ cursorLoading: true });
			const res = await axios.post("/api/v1/blog", value);
			console.log(res);

			id = res.data.newBlog.id;
		} catch (error) {
			toast.error("Errow while creating Blog!");
		} finally {
			set({ cursorLoading: false });
			return id;
		}
	},

	putBlog: async (value) => {
		let flag: Boolean = false;

		try {
			set({ updatingPost: true });
			await axios.put("/api/v1/blog", value);
			flag = true;
		} catch (error) {
		} finally {
			set({ updatingPost: false });
			return flag;
		}
	},

	getBlog: async (value) => {
		let blog: BlogType | undefined = undefined;

		try {
			const res = await toast.promise(axios.get(`/api/v1/blog/${value.id}`), {
				loading: "",
				success: "",
				error: "",
			});			
			blog = res.data;
		} catch (error) {
		} finally {
			return blog;
		}
	},

	getBlogs: async () => {
		try {
			const res = await axios.get(`/api/v1/blog/bulk`);			
			set({ feedBlogs: res.data });
		} catch (error) {
		} finally {
		}
	},

	deleteBlog: async (value) => {
		try {
			await axios.delete(`/api/v1/blog/${value.id}`);
		} catch (error) {
		} finally {
			return;
		}
	},
}));
