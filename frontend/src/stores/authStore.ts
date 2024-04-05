import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";
import { signUpSchemaType, signinSchemaType } from "@aayushlad/medium-clone-common";
import { NavigateFunction } from "react-router-dom";

type User = {
	id: string;
	email: string;
	name: string;
};

type authStoreType = {
	loading: boolean;
	isLoggedIn: boolean;
	user: User | undefined;
	signup: (values: signUpSchemaType, navigate: NavigateFunction) => void;
	signin: (values: signinSchemaType, navigate: NavigateFunction) => void;
	getUser: () => void;
};

export const authStore = create<authStoreType>((set) => ({
	loading: true,
	isLoggedIn: false,
	user: undefined,

	signup: async function (values, navigate) {
		try {
			await toast.promise(axios.post("/api/v1/user/signup", values), {
				loading: "Signing up...",
				success: "Signed up!",
				error: "Error signing up!",
			});
			set({ isLoggedIn: true });
			setTimeout(() => navigate("/"), 1000);
		} catch (error) {}
	},

	signin: async function (values, navigate) {
		try {
			await toast.promise(axios.post("/api/v1/user/signin", values), {
				loading: "Signing in...",
				success: "Signed in!",
				error: "Error signing in!",
			});
			set({ isLoggedIn: true });
			setTimeout(() => navigate("/"), 1000);
		} catch (error) {}
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

export default authStore;
