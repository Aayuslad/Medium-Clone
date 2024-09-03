import { signUpUserSchemaType, signinUserSchemaType, topicType, userType } from "@aayushlad/medium-clone-common";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { NavigateFunction } from "react-router-dom";
import { create } from "zustand";
import apiErrorHandler, { ErrorResponse } from "../helper/apiErrorHandler";

type AuthStoreType = {
	loading: boolean;
	isLoggedIn: boolean;
	user: userType | undefined;
	topics: topicType[] | [];
	setUser: (user: userType) => void;
	signup: (values: signUpUserSchemaType, navigate: NavigateFunction) => Promise<void>;
	signin: (values: signinUserSchemaType, navigate: NavigateFunction) => Promise<void>;
	signOut: () => Promise<void>;
	getUser: () => Promise<void>;
};

export const AuthStore = create<AuthStoreType>((set) => ({
	loading: true,
	isLoggedIn: false,
	user: undefined,
	topics: [],

	setUser: (user: userType) => set({ user }),

	signup: async (values, navigate) => {
		let toastId: string | undefined;
		const { getUser } = AuthStore.getState();

		try {
			toastId = toast.loading("Signing up...");
			await axios.post("/api/v1/user/signup", values);
			toast.dismiss(toastId);
			toast.success("Signed up!");
			set({ isLoggedIn: true });
			await getUser();
			setTimeout(() => navigate("/"), 1000);
		} catch (error) {
			apiErrorHandler(error, toastId);
		}
	},

	signin: async (values, navigate) => {
		let toastId: string | undefined;
		const { getUser } = AuthStore.getState();

		try {
			toastId = toast.loading("Signing in...");
			await axios.post("/api/v1/user/signin", values);
			toast.dismiss(toastId);
			toast.success("Signed in!");
			set({ isLoggedIn: true });
			await getUser();
			setTimeout(() => navigate("/"), 1000);
		} catch (error) {
			apiErrorHandler(error, toastId);
		}
	},

	signOut: async () => {
		try {
			await toast.promise(axios.post("/api/v1/user/signOut"), {
				loading: "Signing out...",
				success: "Signed out!",
				error: "Error signing out!",
			});
			set({ user: undefined, isLoggedIn: false });
		} catch (error) {
			apiErrorHandler(error);
		}
	},

	getUser: async () => {
		try {
			set({ loading: true });
			const { data } = await axios.get("/api/v1/user");
			set({ user: data, isLoggedIn: true });
		} catch (error) {
			// @ts-ignore
			toast.error(error.response.data.message, {
				position: "bottom-left",
				duration: 5000,
			});
			const err = error as AxiosError<ErrorResponse>;
			set({
				isLoggedIn: false,
				topics: err.response?.data.topics || [],
			});
		} finally {
			set({ loading: false });
		}
	},
}));
