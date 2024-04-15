import { clapStorySchemaType, storyType } from "@aayushlad/medium-clone-common";
import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

type storyStoreType = {
	cursorLoading: boolean;
	skelitonLoading: boolean;
	putStoryLoading: boolean | undefined;
	feedStories: storyType[] | [];
	postStory: (value: FormData) => Promise<string>;
	putStory: (value: FormData) => Promise<boolean>;
	getStory: (value: { id: string }) => Promise<storyType | undefined>;
	getStories: () => void;
	deleteStory: (value: { id: string }) => void;
	clapStory: (value: clapStorySchemaType) => void;
	saveStory: (value: clapStorySchemaType) => void;
};

export const StoryStore = create<storyStoreType>((set) => ({
	cursorLoading: false,
	skelitonLoading: false,
	putStoryLoading: undefined,
	feedStories: [],

	postStory: async (values) => {
		let id: string = "";

		try {
			set({ cursorLoading: true });
			const res = await axios.post("/api/v1/story", values);
			id = res.data.id;
		} catch (error) {
			console.log(error);			
			toast.error("Error while creating Story!");
		} finally {
			set({ cursorLoading: false });
			return id;
		}
	},

	putStory: async (values) => {
		let flag: boolean = false;

		try {
			set({ putStoryLoading: true });
			await axios.put("/api/v1/story", values);
			flag = true;
		} catch (error) {
			toast.error("Error while updating Story!");
		} finally {
			set({ putStoryLoading: false });
			return flag;
		}
	},

	getStory: async (values) => {
		try {
			set({ skelitonLoading: true });
			const res = await axios.get(`/api/v1/story/${values.id}`);
			console.log(res.data);
			return res.data;
		} catch (error) {
			toast.error("Error while fetching Story!");
		} finally {
			set({ skelitonLoading: false });
		}
	},

	getStories: async () => {
		try {
			set({ skelitonLoading: true });
			const res = await axios.get(`/api/v1/story/bulk`);
			set({ feedStories: res.data });
		} catch (error) {
			toast.error("Error while fetching Story!");
		} finally {
			set({ skelitonLoading: false });
		}
	},

	deleteStory: async (values) => {
		try {
			await axios.delete(`/api/v1/story/${values.id}`);
		} catch (error) {
		} finally {
			return;
		}
	},

	clapStory: async (values) => {
		try {
			set({ putStoryLoading: true });
			await axios.post(`/api/v1/story/clap`, values);
		} catch (error: any) {
			console.log(error);
			if (error.response.status == 401) {
				toast.error("Signin To clap");
			}
		} finally {
			set({ putStoryLoading: false });
		}
	},

	saveStory: async (values) => {
		try {
			set({ putStoryLoading: true });
			await axios.post(`/api/v1/story/save`, values);
		} catch (error: any) {
			console.log(error);
			if (error.response.status == 401) {
				toast.error("Signin To save");
			}
		} finally {
			set({ putStoryLoading: false });
		}
	},
}));
