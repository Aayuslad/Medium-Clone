import {
	storyType,
	topicType,
	updateUserAboutSectionSchemaType,
	userType,
} from "@aayushlad/medium-clone-common";
import axios from "axios";
import { toast } from "react-hot-toast";
import { create } from "zustand";

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
	refineReconmandations: {
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
		authors: userType[] | [];
		stories: storyType[] | [];
		topics: topicType[] | [];
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
	getUserRecomendations: (values: { userId?: string }) => Promise<void>;
};

export const UsersStore = create<authStoreType>((set) => ({
	skeletonLoading: false,
	buttonLoading: false,
	refineReconmandations: { Following: [], Muted: [], "Discover Authors": [], "Discover Topics": [] },
	userRecomendations: {
		recommendedTopics: [],
		whoToFollow: [],
		recentlySaved: [],
	},
	searchResultPage: {
		authors: [],
		stories: [],
		topics: [],
	},

	getAnotherUser: async function (values) {
		try {
			set({ skeletonLoading: true });
			const response = await axios.get(`/api/v1/user/userProfile/${values.id}`);
			return response.data;
		} catch (error) {
			console.error(error);
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
			console.error(error);
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
			if (toastId) {
				toast.dismiss(toastId);
			}
			toast.error(error.response.data.error || "Error while updating!");
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
			if (toastId) {
				toast.dismiss(toastId);
			}
			toast.error(error.response.data.error || "Error while updating!");
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
			toast.error("Error while following user!");
		} finally {
			set({ buttonLoading: false });
		}
	},

	muteAuthor: async (values) => {
		try {
			set({ buttonLoading: true });
			await axios.post(`api/v1/user/muteAuthor/${values.authorId}`);
		} catch (error) {
			toast.error("Error while muting author!");
		} finally {
			set({ buttonLoading: false });
		}
	},

	getUserFollowingAuthors: async (values) => {
		try {
			set({ skeletonLoading: true });
			const res = await axios.get(`api/v1/user/getUserFollowingAuthors?page=${values.currentPage}`);
			set((state) => ({
				refineReconmandations: {
					...state.refineReconmandations,
					Following: [...state.refineReconmandations.Following, ...(res.data || [])],
				},
			}));
			if (res.data.length < 12) values.setIsAllDataLoaded((state) => ({ ...state, Following: true }));
		} catch (error) {
			toast.error("Error while getting following authors!");
		} finally {
			set({ skeletonLoading: false });
		}
	},

	getUserMutedAuthors: async (values) => {
		try {
			set({ skeletonLoading: true });
			const res = await axios.get(`api/v1/user/getUserMutedAuthors?page=${values.currentPage}`);
			set((state) => ({
				refineReconmandations: {
					...state.refineReconmandations,
					Muted: [...state.refineReconmandations.Muted, ...(res.data || [])],
				},
			}));
			if (res.data.length < 12) values.setIsAllDataLoaded((state) => ({ ...state, Muted: true }));
		} catch (error) {
			toast.error("Error while getting muted authors!");
		} finally {
			set({ skeletonLoading: false });
		}
	},

	getRandomAuthors: async (values) => {
		try {
			set({ skeletonLoading: true });
			const res = await axios.get(`api/v1/user/getRandomAuthors?page=${values.currentPage}`);
			set((state) => ({
				refineReconmandations: {
					...state.refineReconmandations,
					"Discover Authors": [
						...state.refineReconmandations["Discover Authors"],
						...(res.data || []),
					],
				},
			}));
			if (res.data.length < 12)
				values.setIsAllDataLoaded((state) => ({ ...state, "Discover Authors": true }));
		} catch (error) {
			toast.error("Error while getting random authors!");
		} finally {
			set({ skeletonLoading: false });
		}
	},

	getRandomTopics: async (values) => {
		try {
			set({ skeletonLoading: true });
			const res = await axios.get(`api/v1/user/getRandomTopics?page=${values.currentPage}`);
			set((state) => ({
				refineReconmandations: {
					...state.refineReconmandations,
					"Discover Topics": [
						...state.refineReconmandations["Discover Topics"],
						...(res.data || []),
					],
				},
			}));
			if (res.data.length < 12)
				values.setIsAllDataLoaded((state) => ({ ...state, "Discover Topics": true }));
		} catch (error) {
			toast.error("Error while getting random topics!");
		} finally {
			set({ skeletonLoading: false });
		}
	},

	globalSearch: async (values) => {
		try {
			const res = await axios.get(`api/v1/user/searchBox?query=${values.searchQuery}`);
			return res.data;
		} catch (error) {
			toast.error("Error while searching!");
		} finally {
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
					authors: [...state.searchResultPage.authors, ...(res.data || [])],
				},
			}));
			if (res.data.length < 8) values.setIsAllDataLoaded((state) => ({ ...state, People: true }));
		} catch (error) {
			toast.error("Error while getting authors!");
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
					stories: [...state.searchResultPage.stories, ...(res.data || [])],
				},
			}));
			if (res.data.length < 8) values.setIsAllDataLoaded((state) => ({ ...state, Stories: true }));
		} catch (error) {
			toast.error("Error while getting stories!");
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
					topics: [...state.searchResultPage.topics, ...(res.data || [])],
				},
			}));
			if (res.data.length < 8) values.setIsAllDataLoaded((state) => ({ ...state, Topics: true }));
		} catch (error) {
			toast.error("Error while getting topics!");
		} finally {
			set({ skeletonLoading: false });
		}
	},

	getUserRecomendations: async (values) => {
		try {
			const res = await axios.get(`api/v1/user/getUserRecomendations?userId=${values.userId}`);
			set({ userRecomendations: res.data });
		} catch (error) {
			toast.error("Error while getting recomendations!");
		} finally {
		}
	},
}));
