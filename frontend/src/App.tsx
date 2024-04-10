import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import LoadingPage from "./pages/LoadingPage";
import HomePage from "./pages/HomePage";
import ComposeBlogPage from "./pages/ComposeBlogPage";
import ReadBlogPage from "./pages/ReadBlogPage";
import ProfilePage from "./pages/ProfilePage";
import { AuthStore } from "./stores/authStore";
import { useEffect } from "react";

export default function App() {
	const authStore = AuthStore();

	useEffect(() => {
		authStore.getUser();
	}, [])
	
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={authStore.loading ? <LoadingPage /> : <HomePage />} />
				<Route path="/signup" element={<SignupPage />} />
				<Route path="/signin" element={<SigninPage />} />
				<Route
					path="/compose/:id"
					element={authStore.loading ? <LoadingPage /> : <ComposeBlogPage />}
				/>
				<Route path="/blog/:id" element={authStore.loading ? <LoadingPage /> : <ReadBlogPage />} />
				<Route path="/user/:id" element={authStore.loading ? <LoadingPage /> : <ProfilePage />} />
			</Routes>
		</BrowserRouter>
	);
}
