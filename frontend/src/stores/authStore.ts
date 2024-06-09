import { signUpUserSchemaType, signinUserSchemaType, userType } from "@aayushlad/medium-clone-common";
import axios from "axios";
import { toast } from "react-hot-toast";
import { NavigateFunction } from "react-router-dom";
import { create } from "zustand";

type authStoreType = {
	loading: boolean;
	isLoggedIn: boolean;
	user: userType | undefined;
	setUser: (user: userType) => void;
	signup: (values: signUpUserSchemaType, navigate: NavigateFunction) => void;
	signin: (values: signinUserSchemaType, navigate: NavigateFunction) => void;
	signOut: () => void;
	getUser: () => void;
};

export const AuthStore = create<authStoreType>((set) => ({
	loading: true,
	isLoggedIn: false,
	user: undefined,
	setUser: (user: userType) => {
		set({ user });
	},

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
			toast.error(error.response.data.message || "Error while signing up!");
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
			toast.error(error.response.data.message || "Error while signing in!");
		}
	},

	signOut: async function () {
		try {
			await toast.promise(axios.post("/api/v1/user/signOut"), {
				loading: "Signing out...",
				success: "Signed out!",
				error: "Error signing out!",
			});
			set({ user: undefined });
			set({ isLoggedIn: false });
		} catch (error) {
			console.log("Error signing out");
		}
	},

	getUser: async function () {
		try {
			set({ loading: true });
			const response = await axios.get("/api/v1/user");
			set({ user: response.data, isLoggedIn: true });
		} catch (error) {
		} finally {
			set({ loading: false });
		}
	},
}));
