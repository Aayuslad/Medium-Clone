import { storyType, updateUserAboutSectionSchemaType, userType } from "@aayushlad/medium-clone-common";
import axios from "axios";
import { toast } from "react-hot-toast";
import { create } from "zustand";

type authStoreType = {
	skeletonLoading: boolean;
	buttonLoading: boolean;
	getAnotherUser: (values: { id: string }) => Promise<userType>;
	getUserStories: (values: {
		id: string;
		page: number;
		setAllStoriesLoaded: React.Dispatch<React.SetStateAction<boolean>>;
	}) => Promise<storyType[]>;
	updateUser: (values: FormData, getUser: () => void) => Promise<void>;
	updateUserAboutSection: (values: updateUserAboutSectionSchemaType) => Promise<boolean>;
	followUser: (values: { userIdToFollow: string }) => void;
};

export const UsersStore = create<authStoreType>((set) => ({
	skeletonLoading: false,
	buttonLoading: false,

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
}));
