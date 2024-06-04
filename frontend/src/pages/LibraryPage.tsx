import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import StoryPreview from "../components/StoryPreview";
import RegularLeftContainerNavbar from "../components/navbars/RegularLeftContainerNavbar";
import BlogsSkelitons from "../components/skelitons/StorySkeletons";
import LeftContainer from "../components/wrapperComponents/LeftContainer";
import MainConntainer from "../components/wrapperComponents/MainContainer";
import RightContainer from "../components/wrapperComponents/RightContainer";
import { StoryStore } from "../stores/storyStore";

const LibraryPage = () => {
	const storyStore = StoryStore();
	const mainContainerRef = useRef<HTMLDivElement | null>(null);
	const { nav } = useParams<{ nav: string }>();
	const [currentNav, setCurrentNav] = useState<string>(nav || "Saved stories");
	const [pageNumbers, setPageNumbers] = useState<{ [key: string]: number }>();
	const [isAllStoriesLoded, setIsAllStoriesLoaded] = useState<{ [key: string]: Boolean }>({});

	useEffect(() => {
		function updatepageNumbers() {
			setPageNumbers((prevPageNumbers) => ({
				...(prevPageNumbers || {}),
				[currentNav]: prevPageNumbers?.[currentNav] || 1,
			}));
		}
		updatepageNumbers();
	}, [currentNav]);

	useEffect(() => {
		const currentPage = pageNumbers?.[currentNav] || 1;

		if (pageNumbers === undefined) return;

		switch (currentNav) {
			case "Saved stories":
				if (storyStore.savedStories.length === currentPage * 5 || isAllStoriesLoded[currentNav])
					return;
				storyStore.getSavedStories({ currentPage, setIsAllStoriesLoaded });
				break;
			case "Reading History":
				if (storyStore.readingHistory.length === currentPage * 5 || isAllStoriesLoded?.[currentNav])
					return;
				storyStore.getReadingHistory({ currentPage, setIsAllStoriesLoaded });
				break;
		}
	}, [pageNumbers]);

	// pagination logic
	const handleScroll = () => {
		if (mainContainerRef.current) {
			const mainContainer = mainContainerRef.current;
			const containerBottom = mainContainer.offsetTop + mainContainer.offsetHeight;
			const scrollPosition = window.pageYOffset + window.innerHeight;

			if (
				scrollPosition >= containerBottom - 1 &&
				!storyStore.skeletonLoading &&
				(isAllStoriesLoded?.[currentNav] || true)
			) {
				setPageNumbers((prevPageNumbers) => ({
					...prevPageNumbers,
					[currentNav]: (prevPageNumbers?.[currentNav] || 1) + 1,
				}));
			}
		}
	};

	// scroll event
	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [currentNav]);

	return (
		<div className="LibraryPage">
			<Header />

			<MainConntainer ref={mainContainerRef}>
				<LeftContainer>
					<h2 className="text-5xl font-semibold py-12">Your Library</h2>

					<RegularLeftContainerNavbar
						page="libray"
						navs={["Saved stories", "Reading History"]}
						currentNav={currentNav}
						setCurrentNav={setCurrentNav}
					/>

					{currentNav === "Saved stories" && (
						<>
							{storyStore.savedStories.map((story, index) => (
								<StoryPreview story={story} key={index} version="profile" />
							))}
						</>
					)}

					{currentNav === "Reading History" && (
						<>
							{storyStore.readingHistory.map((story, index) => (
								<StoryPreview story={story} key={index} version="profile" />
							))}
						</>
					)}

					{storyStore.skeletonLoading && <BlogsSkelitons />}
				</LeftContainer>
				<RightContainer>right</RightContainer>
			</MainConntainer>
		</div>
	);
};

export default LibraryPage;
