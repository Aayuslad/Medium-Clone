import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import LoadingPage from "./pages/LoadingPage";
import HomePage from "./pages/HomePage";
import ComposeBlogPage from "./pages/ComposeBlogPage";
import ReadBlogPage from "./pages/ReadBlogPage";
import authStore from "./stores/authStore";
import { useEffect } from "react";

export default function App() {
	const store = authStore();

	useEffect(() => {
		store.getUser();
	}, [])
	
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={store.loading ? <LoadingPage /> : <HomePage />} />
				<Route path="/signup" element={<SignupPage />} />
				<Route path="/signin" element={<SigninPage />} />
				<Route path="/compose/:id" element={store.loading ? <LoadingPage /> : <ComposeBlogPage />} />
				<Route path="/blog/:id" element={<ReadBlogPage />} />
			</Routes>
		</BrowserRouter>
	);
}
