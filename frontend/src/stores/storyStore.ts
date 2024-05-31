import {
	clapStorySchemaType,
	editReplySchemaType,
	editResponseSchemaType,
	makeReplyToResponseSchemaType,
	responseType,
	storyType,
	topicType,
} from "@aayushlad/medium-clone-common";
import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { makeResponseSchemaType } from "../components/ResponseBox";

type storyStoreType = {
	cursorLoading: boolean;
	skeletonLoading: boolean;
	putStoryLoading: boolean | undefined;
	buttonLoading: boolean;
	feedStories: { topic: string; stories: storyType[] }[] | [];
	savedStories: storyType[] | [];
	readingHistory: storyType[] | [];
	topic: topicType | undefined;
	setTopic: (topic: topicType) => void;
	postStory: (value: FormData) => Promise<string>;
	putStory: (value: FormData) => Promise<boolean>;
	getStory: (value: { id: string }) => Promise<storyType | undefined>;
	getStories: (
		page: number,
		setAllStoriesLoaded: React.Dispatch<React.SetStateAction<boolean>>,
	) => Promise<void>;
	getStoriesByTopics: (values: { topics: string[] }) => Promise<void>;
	getStoriesByAuthor: () => Promise<void>;
	deleteStory: (value: { id: string }) => void;
	clapStory: (value: clapStorySchemaType) => void;
	saveStory: (value: clapStorySchemaType) => void;
	getSavedStories: () => Promise<void>;
	getReadingHistory: () => Promise<void>;
	removeStoryFromFeed: (id: string) => void;
	getTopic: (topic: string) => Promise<void>;
	followTopic: (values: { topicId: string }) => Promise<void>;
	makeResponse: (values: makeResponseSchemaType) => Promise<responseType | undefined>;
	getResponseByStoryId: (
		values: { storyId: string },
		page: number,
		pageSize?: number,
	) => Promise<responseType[] | undefined>;
	editResponse: (values: editResponseSchemaType) => Promise<responseType | undefined>;
	deleteResponse: (responseId: string) => Promise<boolean>;
	makeReplyToResponse: (values: makeReplyToResponseSchemaType) => Promise<responseType | undefined>;
	getReplyByResponseId: (
		values: { responseId: string },
		page: number,
	) => Promise<responseType[] | undefined>;
	editReply: (values: editReplySchemaType) => Promise<responseType | undefined>;
	deleteReply: (responseId: string) => Promise<void>;
};

export const StoryStore = create<storyStoreType>((set) => ({
	cursorLoading: false,
	skeletonLoading: false,
	putStoryLoading: undefined,
	buttonLoading: false,
	feedStories: [],
	savedStories: [],
	readingHistory: [],
	topic: undefined,
	setTopic: (topic) => {
		set({ topic });
	},

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
			set({ skeletonLoading: true });
			const res = await axios.get(`/api/v1/story/${values.id}`);
			return res.data;
		} catch (error) {
			toast.error("Error while fetching Story!");
		} finally {
			set({ skeletonLoading: false });
		}
	},

	getStories: async (page = 1, setAllStoriesLoaded, pageSize = 5) => {
		try {
			set({ skeletonLoading: true });
			const res = await axios.get(`/api/v1/story/bulk?page=${page}&pageSize=${pageSize}`);
			set((state) => ({
				feedStories: state.feedStories
					.map((story) => {
						if (story.topic === "For you") {
							return {
								topic: story.topic,
								stories: [...story.stories, ...res.data],
							};
						}
						return story;
					})
					.concat(
						state.feedStories.every((story) => story.topic !== "For you")
							? [
									{
										topic: "For you",
										stories: res.data,
									},
							  ]
							: [],
					),
			}));
			if (res.data.length < pageSize) {
				setAllStoriesLoaded(true);
			}
		} catch (error) {
			toast.error("Error while fetching Story!");
		} finally {
			set({ skeletonLoading: false });
		}
	},

	getStoriesByTopics: async (values) => {
		try {
			set({ skeletonLoading: true });
			const res = await axios.get(`/api/v1/story/getStoriesByTopics/${values.topics}`);
			set((state) => ({
				feedStories: [
					...state.feedStories,
					{
						topic: res.data.topic,
						stories: res.data.stories,
					},
				],
			}));
		} catch (error) {
			console.log(error);

			toast.error("Error while fetching Story!");
		} finally {
			set({ skeletonLoading: false });
		}
	},

	getStoriesByAuthor: async () => {
		try {
			set({ skeletonLoading: true });
			const res = await axios.get(`/api/v1/story/getStoriesByAuthor`);
			set((state) => ({
				feedStories: [
					...state.feedStories,
					{
						topic: res.data.topic,
						stories: res.data.stories,
					},
				],
			}));
		} catch (error) {
			toast.error("Error while fetching Story!");
		} finally {
			set({ skeletonLoading: false });
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

	getSavedStories: async () => {
		try {
			set({ skeletonLoading: true });
			const res = await axios.get("/api/v1/story/savedStories");
			set({ savedStories: res.data });
		} catch (error) {
			toast.error("Error while fetching Story!");
		} finally {
			set({ skeletonLoading: false });
		}
	},

	getReadingHistory: async () => {
		try {
			set({ skeletonLoading: true });
			const res = await axios.get("/api/v1/story/readingHistory");
			console.log(res.data);
			set({ readingHistory: res.data });
		} catch (error) {
			toast.error("Error while fetching Story!");
		} finally {
			set({ skeletonLoading: false });
		}
	},

	removeStoryFromFeed: (id: string) => {
		set((state) => {
			return {
				feedStories: state.feedStories.map((feedStory) => {
					return {
						topic: feedStory.topic,
						stories: feedStory.stories.filter((story) => story.id !== id),
					};
				}),
			};
		});
	},

	getTopic: async (topic: string) => {
		try {
			set({ skeletonLoading: true });
			const res = await axios.get(`/api/v1/story/topic/${topic}`);
			set({ topic: res.data });
		} catch (error) {
			toast.error("Error while fetching topic!");
		} finally {
			set({ skeletonLoading: false });
		}
	},

	followTopic: async (values) => {
		try {
			set({ buttonLoading: true });
			await axios.post(`/api/v1/story/followTopic`, values);
		} catch (error) {
			toast.error("Error while following topic!");
		} finally {
			set({ buttonLoading: false });
		}
	},

	makeResponse: async (values) => {
		try {
			set({ buttonLoading: true });
			const res = await axios.post("/api/v1/story/makeResponse", values);
			return res.data;
		} catch (error) {
			toast.error("Error while making response!");
		} finally {
			set({ buttonLoading: false });
		}
	},

	getResponseByStoryId: async (values, page = 1, pageSize = 6) => {
		try {
			set({ skeletonLoading: true });
			const res = await axios.get(
				`/api/v1/story/responses/${values.storyId}?page=${page}&pageSize=${pageSize}`,
			);
			return res.data;
		} catch (error) {
			toast.error("Error while fetching response!");
		} finally {
			set({ skeletonLoading: false });
		}
	},

	editResponse: async (values) => {
		try {
			set({ buttonLoading: true });
			const res = await axios.put("/api/v1/story/editResponse", values);
			return res.data;
		} catch (error) {
			toast.error("Error while editing response!");
		} finally {
			set({ buttonLoading: false });
		}
	},

	deleteResponse: async (responseId) => {
		let flag = false;

		try {
			set({ buttonLoading: true });
			await axios.delete(`/api/v1/story/deleteResponse/${responseId}`);
			toast.success("Response deleted");
			flag = true;
		} catch (error) {
			toast.error("Error while deleting response!");
		} finally {
			set({ buttonLoading: false });
			return flag;
		}
	},

	makeReplyToResponse: async (values) => {
		try {
			set({ buttonLoading: true });
			const res = await axios.post("/api/v1/story/makeReplyToResponse", values);
			return res.data;
		} catch (error) {
			toast.error("Error while making reply!");
		} finally {
			set({ buttonLoading: false });
		}
	},

	getReplyByResponseId: async (values, page = 1) => {
		try {
			set({ skeletonLoading: true });
			const res = await axios.get(`/api/v1/story/replies/${values.responseId}?page=${page}`);
			return res.data;
		} catch (error) {
			toast.error("Error while fetching replies!");
		} finally {
			set({ skeletonLoading: false });
		}
	},

	editReply: async (values) => {
		try {
			set({ buttonLoading: true });
			const res = await axios.put("/api/v1/story/editResponse", values);
			return res.data;
		} catch (error) {
			toast.error("Error while editing response!");
		} finally {
			set({ buttonLoading: false });
		}
	},

	deleteReply: async (responseId) => {
		try {
			set({ buttonLoading: true });
			await axios.delete(`/api/v1/story/deleteResponse/${responseId}`);
		} catch (error) {
			toast.error("Error while deleting response!");
		} finally {
			set({ buttonLoading: false });
		}
	},
}));
