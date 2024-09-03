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
		setCurrentNav(nav || "Saved stories");
	}, [nav]);

	// update the page numbers of the stories
	useEffect(() => {
		function updatepageNumbers() {
			const stories = storyStore.libraryPage[currentNav as keyof typeof storyStore.libraryPage];
			if (stories?.length > 0) {
				if (stories.length < 5) {
					setIsAllStoriesLoaded((prevIsAllStoriesLoaded) => ({
						...(prevIsAllStoriesLoaded || {}),
						[currentNav]: true,
					}));
					return;
				}
				const pageNumber = Math.ceil(stories?.length / 5);
				setPageNumbers((prevPageNumbers) => ({
					...(prevPageNumbers || {}),
					[currentNav]: pageNumber,
				}));
			} else {
				setPageNumbers((prevPageNumbers) => ({
					...(prevPageNumbers || {}),
					[currentNav]: prevPageNumbers?.[currentNav] || 1,
				}));
			}
		}
		updatepageNumbers();
	}, [currentNav]);

	// data fetching logic
	useEffect(() => {
		const currentPage = pageNumbers?.[currentNav] || 1;

		if (pageNumbers === undefined) return;

		switch (currentNav) {
			case "Saved stories":
				if (storyStore.libraryPage.savedStories.length === currentPage * 5 || isAllStoriesLoded[currentNav]) return;
				storyStore.getSavedStories({ currentPage, setIsAllStoriesLoaded });
				break;
			case "Reading History":
				if (storyStore.libraryPage.readingHistory.length === currentPage * 5 || isAllStoriesLoded?.[currentNav]) return;
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
				scrollPosition >= containerBottom - 100 &&
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
							{storyStore.libraryPage.savedStories.map((story, index) => (
								<StoryPreview story={story} key={index} version="profile" />
							))}

							{!storyStore.skeletonLoading && storyStore.libraryPage.savedStories.length === 0 && (
								<div className="flex flex-col justify-center items-center h-80 w-full text-gray-600">
									<h3 className="text-2xl font-semibold">Nothing Saved Yet!</h3>
									<p>Save some stories and it will apper here.</p>
								</div>
							)}
						</>
					)}

					{currentNav === "Reading History" && (
						<>
							{storyStore.libraryPage.readingHistory.map((story, index) => (
								<StoryPreview story={story} key={index} version="profile" />
							))}

							{!storyStore.skeletonLoading && storyStore.libraryPage.readingHistory.length === 0 && (
								<div className="flex flex-col justify-center items-center h-80 w-full text-gray-600">
									<h3 className="text-2xl font-semibold">You haven't read any stories Yet!</h3>
									<p>Stories you’ve read on Medium will appear here.</p>
								</div>
							)}
						</>
					)}

					{storyStore.skeletonLoading && <BlogsSkelitons />}
				</LeftContainer>
				<RightContainer />
			</MainConntainer>
		</div>
	);
};

export default LibraryPage;
