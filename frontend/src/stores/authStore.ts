import { signUpSchemaType, signinSchemaType, userType } from "@aayushlad/medium-clone-common";
import axios from "axios";
import { toast } from "react-hot-toast";
import { NavigateFunction } from "react-router-dom";
import { create } from "zustand";

type authStoreType = {
	loading: boolean;
	isLoggedIn: boolean;
	user: userType | undefined;
	signup: (values: signUpSchemaType, navigate: NavigateFunction) => void;
	signin: (values: signinSchemaType, navigate: NavigateFunction) => void;
	signOut: () => void;
	getUser: () => void;
};

export const AuthStore = create<authStoreType>((set) => ({
	loading: true,
	isLoggedIn: false,
	user: undefined,

	signup: async function (values, navigate) {
		let toastId: string | undefined;
		const { getUser } = AuthStore.getState();

		try {
			toastId = toast.loading("Signing up...");
			await axios.post("/api/v1/user/signup", values);
			toast.dismiss(toastId);
			toast.success("Signed up!");
			set({ isLoggedIn: true });
			getUser();
			setTimeout(() => navigate("/"), 1000);
		} catch (error: any) {
			if (toastId) {
				toast.dismiss(toastId);
			}
			toast.error(error.response.data.error || "Error while signing up!");
		}
	},

	signin: async function (values, navigate) {
		let toastId: string | undefined;
		const { getUser } = AuthStore.getState();

		try {
			toastId = toast.loading("Signing in...");
			await axios.post("/api/v1/user/signin", values);
			toast.dismiss(toastId);
			toast.success("Signed in!");
			set({ isLoggedIn: true });
			getUser();
			setTimeout(() => navigate("/"), 1000);
		} catch (error: any) {
			if (toastId) {
				toast.dismiss(toastId);
			}
			toast.error(error.response.data.error || "Error while signing in!");
		}
	},

	signOut: async function () {
		try {
			await toast.promise(axios.post("/api/v1/user/signOut"), {
				loading: "Signing out...",
				success: "Signed out!",
				error: "Error signing out!",
			});
			set({ isLoggedIn: false });
		} catch (error) {
			console.log("Error signing out");
		}
	},

	getUser: async function () {
		try {
			set({ loading: true });
			const response = await axios.get("/api/v1/user");
			console.log("user", response.data);
			set({ user: response.data, isLoggedIn: true });
		} catch (error) {
			console.error(error);
		} finally {
			set({ loading: false });
		}
	},
}));