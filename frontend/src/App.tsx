import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ComposeBlogPage from "./pages/ComposeBlogPage";
import HomePage from "./pages/HomePage";
import LibraryPage from "./pages/LibraryPage";
import LoadingPage from "./pages/LoadingPage";
import ProfilePage from "./pages/ProfilePage";
import ReadBlogPage from "./pages/ReadStoryPage";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import { AuthStore } from "./stores/authStore";

export default function App() {
	const authStore = AuthStore();

	useEffect(() => {
		authStore.getUser();
	}, []);

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
				<Route path="/story/:id" element={authStore.loading ? <LoadingPage /> : <ReadBlogPage />} />
				<Route path="/user/:id" element={authStore.loading ? <LoadingPage /> : <ProfilePage />} />
				<Route path="/libray" element={authStore.loading ? <LoadingPage /> : <LibraryPage />} />
			</Routes>
		</BrowserRouter>
	);
}
