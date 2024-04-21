import { updateUserAboutSectionSchemaType, userType } from "@aayushlad/medium-clone-common";
import axios from "axios";
import { toast } from "react-hot-toast";
import { create } from "zustand";

type authStoreType = {
	skelitonLoading: boolean;
	buttonLoading: boolean;
	getAnotherUser: (values: { id: string }) => Promise<userType>;
	updateUser: (values: FormData, getUser: () => void) => Promise<void>;
	updateUserAboutSection: (values: updateUserAboutSectionSchemaType) => Promise<boolean>;
	followUser: (values: { userIdToFollow: string }) => void;
};

export const UsersStore = create<authStoreType>((set) => ({
	skelitonLoading: false,
	buttonLoading: false,

	getAnotherUser: async function (values) {
		try {
			set({ skelitonLoading: true });
			const response = await axios.get(`/api/v1/user/userProfile/${values.id}`);
			return response.data;
		} catch (error) {
			console.error(error);
		} finally {
			set({ skelitonLoading: false });
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
