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
import TopicPage from "./pages/TopicPage";
import RefineRecommendations from "./pages/RefineRecomandations";
import StoriesPage from "./pages/StoriesPage";
import NotificationsPage from "./pages/NotificationsPage";

export default function App() {
	const authStore = AuthStore();

	useEffect(() => {
		authStore.getUser();
	}, []);

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={authStore.loading ? <LoadingPage /> : <HomePage />} />
				<Route path="/:nav" element={authStore.loading ? <LoadingPage /> : <HomePage />} />
				<Route path="/signup" element={<SignupPage />} />
				<Route path="/signin" element={<SigninPage />} />
				<Route
					path="/compose/:id"
					element={authStore.loading ? <LoadingPage /> : <ComposeBlogPage />}
				/>
				<Route path="/story/:id" element={authStore.loading ? <LoadingPage /> : <ReadBlogPage />} />
				<Route
					path="/user/:id/:nav"
					element={authStore.loading ? <LoadingPage /> : <ProfilePage />}
				/>
				<Route path="/libray/:nav" element={authStore.loading ? <LoadingPage /> : <LibraryPage />} />
				<Route path="/topic/:topic" element={authStore.loading ? <LoadingPage /> : <TopicPage />} />
				<Route
					path="/refineRecommendations/:nav"
					element={authStore.loading ? <LoadingPage /> : <RefineRecommendations />}
				/>
				<Route path="/stories/:nav" element={authStore.loading ? <LoadingPage /> : <StoriesPage />} />
				<Route
					path="/notifications/:nav"
					element={authStore.loading ? <LoadingPage /> : <NotificationsPage />}
				/>
			</Routes>
		</BrowserRouter>
	);
}
