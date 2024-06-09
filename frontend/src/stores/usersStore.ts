import {
	storyType,
	topicType,
	updateUserAboutSectionSchemaType,
	userType,
} from "@aayushlad/medium-clone-common";
import axios from "axios";
import { toast } from "react-hot-toast";
import { create } from "zustand";

type authStoreType = {
	skeletonLoading: boolean;
	buttonLoading: boolean;
	refineReconmandations: {
		Following: userType[];
		Muted: userType[];
		"Discover Authors": userType[];
		"Discover Topics": topicType[];
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
};

export const UsersStore = create<authStoreType>((set) => ({
	skeletonLoading: false,
	buttonLoading: false,
	refineReconmandations: { Following: [], Muted: [], "Discover Authors": [], "Discover Topics": [] },

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
}));
