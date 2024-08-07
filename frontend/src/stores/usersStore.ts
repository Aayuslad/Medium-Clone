import { storyType, topicType, updateUserAboutSectionSchemaType, userType } from "@aayushlad/medium-clone-common";
import axios from "axios";
import { toast } from "react-hot-toast";
import { create } from "zustand";
import apiErrorHandler from "../helper/apiErrorHandler";

export type searchResultType = {
	authors: {
		id: string;
		userName: string;
		profileImg: string;
	}[];
	stories: {
		id: string;
		title: string;
	}[];
	topics: {
		topic: string;
	}[];
};

type authStoreType = {
	skeletonLoading: boolean;
	buttonLoading: boolean;
	refineRecommendationsPage: {
		Following: userType[];
		Muted: userType[];
		"Discover Authors": userType[];
		"Discover Topics": topicType[];
	};
	userRecomendations: {
		recommendedTopics: {
			topic: string;
		}[];
		whoToFollow: {
			id: string;
			userName: string;
			profileImg: string;
			bio: string;
		}[];
		recentlySaved: {
			id: string;
			title: string;
			author: string;
			authorProfileImg: string;
		}[];
	};
	searchResultPage: {
		People: userType[] | [];
		Stories: storyType[] | [];
		Topics: topicType[] | [];
	};

	getAnotherUser: (values: { id: string }) => Promise<userType>;
	getUserStories: (values: {
		id: string;
		page: number;
		setAllStoriesLoaded: React.Dispatch<React.SetStateAction<boolean>>;
	}) => Promise<storyType[]>;
	updateUser: (values: FormData, getUser: () => void) => Promise<void>;
	updateUserAboutSection: (values: updateUserAboutSectionSchemaType) => Promise<boolean>;
	followUser: (values: { userIdToFollow: string }) => void;
	muteAuthor: (values: { authorId: string }) => void;
	getUserFollowingAuthors: (values: {
		currentPage: number;
		setIsAllDataLoaded: React.Dispatch<
			React.SetStateAction<{
				[key: string]: Boolean;
			}>
		>;
	}) => void;
	getUserMutedAuthors: (values: {
		currentPage: number;
		setIsAllDataLoaded: React.Dispatch<
			React.SetStateAction<{
				[key: string]: Boolean;
			}>
		>;
	}) => void;
	getRandomAuthors: (values: {
		currentPage: number;
		setIsAllDataLoaded: React.Dispatch<
			React.SetStateAction<{
				[key: string]: Boolean;
			}>
		>;
	}) => void;
	getRandomTopics: (values: {
		currentPage: number;
		setIsAllDataLoaded: React.Dispatch<
			React.SetStateAction<{
				[key: string]: Boolean;
			}>
		>;
	}) => void;
	globalSearch: (values: { searchQuery: string }) => Promise<searchResultType>;
	getSerchResultPageAuthors: (values: {
		searchQuery: string;
		currentPage: number;
		setIsAllDataLoaded: React.Dispatch<
			React.SetStateAction<{
				[key: string]: Boolean;
			}>
		>;
	}) => Promise<void>;
	getSerchResultPageStories: (values: {
		searchQuery: string;
		currentPage: number;
		setIsAllDataLoaded: React.Dispatch<
			React.SetStateAction<{
				[key: string]: Boolean;
			}>
		>;
	}) => Promise<void>;
	getSerchResultPageTopics: (values: {
		searchQuery: string;
		currentPage: number;
		setIsAllDataLoaded: React.Dispatch<
			React.SetStateAction<{
				[key: string]: Boolean;
			}>
		>;
	}) => Promise<void>;
	resetSearchResultPage: () => void;
	getUserRecomendations: (values: { userId?: string }) => Promise<void>;
};

export const UsersStore = create<authStoreType>((set) => ({
	skeletonLoading: false,
	buttonLoading: false,
	refineRecommendationsPage: {
		Following: [],
		Muted: [],
		"Discover Authors": [],
		"Discover Topics": [],
	},
	userRecomendations: {
		recommendedTopics: [],
		whoToFollow: [],
		recentlySaved: [],
	},
	searchResultPage: {
		People: [],
		Stories: [],
		Topics: [],
	},

	getAnotherUser: async function (values) {
		try {
			set({ skeletonLoading: true });
			const response = await axios.get(`/api/v1/user/userProfile/${values.id}`);
			return response.data;
		} catch (error) {
			apiErrorHandler(error);
		} finally {
			set({ skeletonLoading: false });
		}
	},

	getUserStories: async function (values) {
		try {
			set({ skeletonLoading: true });
			const response = await axios.get(`/api/v1/user/userStories/${values.id}?page=${values.page}`);
			if (response.data.length < 5) values.setAllStoriesLoaded(true);
			return response.data;
		} catch (error) {
			apiErrorHandler(error);
		} finally {
			set({ skeletonLoading: false });
		}
	},

	updateUser: async function (values, getUser) {
		let toastId: string | undefined;

		try {
			set({ buttonLoading: true });
			toastId = toast.loading("Updating...");
			await axios.put("/api/v1/user", values);
			toast.dismiss(toastId);
			toast.success("Updated!");
			getUser();
		} catch (error: any) {
			apiErrorHandler(error, toastId);
		} finally {
			set({ buttonLoading: false });
			return;
		}
	},

	updateUserAboutSection: async function (values) {
		let toastId: string | undefined;

		try {
			set({ buttonLoading: true });
			toastId = toast.loading("Updating...");
			await axios.put("/api/v1/user/aboutSection", values);
			toast.dismiss(toastId);
			toast.success("Updated!");
			return true;
		} catch (error: any) {
			apiErrorHandler(error, toastId);
			return false;
		} finally {
			set({ buttonLoading: false });
		}
	},

	followUser: async (values) => {
		try {
			set({ buttonLoading: true });
			await axios.post("api/v1/user/followUser", values);
		} catch (error) {
			apiErrorHandler(error);
		} finally {
			set({ buttonLoading: false });
		}
	},

	muteAuthor: async (values) => {
		try {
			set({ buttonLoading: true });
			await axios.post(`api/v1/user/muteAuthor/${values.authorId}`);
		} catch (error) {
			apiErrorHandler(error);
		} finally {
			set({ buttonLoading: false });
		}
	},

	getUserFollowingAuthors: async (values) => {
		try {
			set({ skeletonLoading: true });
			const res = await axios.get(`api/v1/user/getUserFollowingAuthors?page=${values.currentPage}`);
			set((state) => ({
				refineRecommendationsPage: {
					...state.refineRecommendationsPage,
					Following: [...state.refineRecommendationsPage.Following, ...(res.data || [])],
				},
			}));
			if (res.data.length < 12) values.setIsAllDataLoaded((state) => ({ ...state, Following: true }));
		} catch (error) {
			apiErrorHandler(error);
		} finally {
			set({ skeletonLoading: false });
		}
	},

	getUserMutedAuthors: async (values) => {
		try {
			set({ skeletonLoading: true });
			const res = await axios.get(`api/v1/user/getUserMutedAuthors?page=${values.currentPage}`);
			set((state) => ({
				refineRecommendationsPage: {
					...state.refineRecommendationsPage,
					Muted: [...state.refineRecommendationsPage.Muted, ...(res.data || [])],
				},
			}));
			if (res.data.length < 12) values.setIsAllDataLoaded((state) => ({ ...state, Muted: true }));
		} catch (error) {
			apiErrorHandler(error);
		} finally {
			set({ skeletonLoading: false });
		}
	},

	getRandomAuthors: async (values) => {
		try {
			set({ skeletonLoading: true });
			const res = await axios.get(`api/v1/user/getRandomAuthors?page=${values.currentPage}`);
			set((state) => ({
				refineRecommendationsPage: {
					...state.refineRecommendationsPage,
					"Discover Authors": [...state.refineRecommendationsPage["Discover Authors"], ...(res.data || [])],
				},
			}));
			if (res.data.length < 12) values.setIsAllDataLoaded((state) => ({ ...state, "Discover Authors": true }));
		} catch (error) {
			apiErrorHandler(error);
		} finally {
			set({ skeletonLoading: false });
		}
	},

	getRandomTopics: async (values) => {
		try {
			set({ skeletonLoading: true });
			const res = await axios.get(`api/v1/user/getRandomTopics?page=${values.currentPage}`);
			set((state) => ({
				refineRecommendationsPage: {
					...state.refineRecommendationsPage,
					"Discover Topics": [...state.refineRecommendationsPage["Discover Topics"], ...(res.data || [])],
				},
			}));
			if (res.data.length < 12) values.setIsAllDataLoaded((state) => ({ ...state, "Discover Topics": true }));
		} catch (error) {
			apiErrorHandler(error);
		} finally {
			set({ skeletonLoading: false });
		}
	},

	globalSearch: async (values) => {
		try {
			const res = await axios.get(`api/v1/user/searchBox?query=${values.searchQuery}`);
			return res.data;
		} catch (error) {
			apiErrorHandler(error);
		}
	},

	getSerchResultPageAuthors: async (values) => {
		try {
			set({ skeletonLoading: true });
			const res = await axios.get(
				`api/v1/user/getSerchResultPageAuthors?query=${values.searchQuery}&page=${values.currentPage}`,
			);
			set((state) => ({
				searchResultPage: {
					...state.searchResultPage,
					People: [...state.searchResultPage.People, ...(res.data || [])],
				},
			}));
			if (res.data.length < 8) values.setIsAllDataLoaded((state) => ({ ...state, People: true }));
		} catch (error) {
			apiErrorHandler(error);
		} finally {
			set({ skeletonLoading: false });
		}
	},

	getSerchResultPageStories: async (values) => {
		try {
			set({ skeletonLoading: true });
			const res = await axios.get(
				`api/v1/user/getSerchResultPageStories?query=${values.searchQuery}&page=${values.currentPage}`,
			);
			set((state) => ({
				searchResultPage: {
					...state.searchResultPage,
					Stories: [...state.searchResultPage.Stories, ...(res.data || [])],
				},
			}));
			if (res.data.length < 8) values.setIsAllDataLoaded((state) => ({ ...state, Stories: true }));
		} catch (error) {
			apiErrorHandler(error);
		} finally {
			set({ skeletonLoading: false });
		}
	},

	getSerchResultPageTopics: async (values) => {
		try {
			set({ skeletonLoading: true });
			const res = await axios.get(
				`api/v1/user/getSerchResultPageTopics?query=${values.searchQuery}&page=${values.currentPage}`,
			);
			set((state) => ({
				searchResultPage: {
					...state.searchResultPage,
					Topics: [...state.searchResultPage.Topics, ...(res.data || [])],
				},
			}));
			if (res.data.length < 8) values.setIsAllDataLoaded((state) => ({ ...state, Topics: true }));
		} catch (error) {
			apiErrorHandler(error);
		} finally {
			set({ skeletonLoading: false });
		}
	},

	resetSearchResultPage: () => {
		set({ searchResultPage: { Stories: [], People: [], Topics: [] } });
	},

	getUserRecomendations: async (values) => {
		const { userRecomendations } = UsersStore.getState();
		try {
			if (userRecomendations.recommendedTopics.length > 0) return;
			const res = await axios.get(`api/v1/user/getUserRecomendations?userId=${values.userId}`);
			set({ userRecomendations: res.data });
		} catch (error) {
			apiErrorHandler(error);
		}
	},
}));
