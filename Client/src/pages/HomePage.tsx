import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import StoryPreview from "../components/StoryPreview";
import TopicsNavbar from "../components/navbars/TopicsNavbar";
import StorySkeletons from "../components/skelitons/StorySkeletons";
import LeftContainer from "../components/wrapperComponents/LeftContainer";
import MainConntainer from "../components/wrapperComponents/MainContainer";
import RightContainer from "../components/wrapperComponents/RightContainer";
import useScrollDirection from "../hooks/useScrollDirection";
import { StoryStore } from "../stores/storyStore";

const HomePage = () => {
	const storyStore = StoryStore();
	const scrollDirection = useScrollDirection();
	const mainContainerRef = useRef<HTMLDivElement | null>(null);
	const { nav } = useParams<{ nav: string | undefined }>();
	const [currentNav, setCurrentNav] = useState<string>(nav || "For you");
	const [pageNumbers, setPageNumbers] = useState<{ [key: string]: number }>();
	const [isAllStoriesLoaded, setIsAllStoriesLoaded] = useState<{ [key: string]: Boolean }>({});

	useEffect(() => {
		setCurrentNav(nav || "For you");
	}, [nav]);

	// update the page numbers of the stories
	useEffect(() => {
		function updatepageNumbers() {
			const stories = storyStore.feedStories.find((story) => story.topic === currentNav)?.stories;
			if ((stories?.length ?? 0) > 0) {
				if ((stories?.length ?? 0) < 5) {
					setIsAllStoriesLoaded((prevIsAllStoriesLoaded) => ({
						...(prevIsAllStoriesLoaded || {}),
						[currentNav]: true,
					}));
					return;
				}
				const pageNumber = Math.ceil((stories?.length ?? 0) / 5);
				setPageNumbers((prevPageNumbers) => ({
					...(prevPageNumbers || {}),
					[currentNav]: pageNumber,
				}));
			} else {
				setPageNumbers((prevPageNumbers) => ({
					...(prevPageNumbers || {}),
					[currentNav]: 1,
				}));
			}
		}

		updatepageNumbers();
	}, [currentNav]);

	// data fetching logic
	useEffect(() => {
		const currentPage = pageNumbers?.[currentNav] || 1;

		if (storyStore.feedStories.find((story) => story.topic === currentNav)?.stories.length === currentPage * 5) {
			return;
		}

		if (pageNumbers === undefined) return;

		switch (currentNav) {
			case "For you":
				if (!isAllStoriesLoaded?.["For you"]) storyStore.getStories({ currentPage, setIsAllStoriesLoaded });
				break;

			case "Following":
				if (!isAllStoriesLoaded?.["Following"]) storyStore.getStoriesByAuthor({ currentPage, setIsAllStoriesLoaded });
				break;

			default:
				if (currentNav !== undefined && !isAllStoriesLoaded?.[currentNav])
					storyStore.getStoriesByTopics({
						topics: [currentNav],
						currentPage,
						setIsAllStoriesLoaded,
					});
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
				(isAllStoriesLoaded?.[currentNav] || true)
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
		<div className="HomePage" style={{ cursor: storyStore.cursorLoading ? "wait" : "default" }}>
			<Header />

			<MainConntainer ref={mainContainerRef}>
				<LeftContainer>
					<div
						className={`topics z-0 h-fit sticky ${
							scrollDirection === "down" ? "top-0" : "top-14"
						} duration-200 bg-white relative md:flex md:items-center md:justify-center lg:block`}
					>
						<TopicsNavbar currentNav={currentNav} setCurrentNav={setCurrentNav} />
					</div>

					{storyStore.feedStories
						?.find((feedStory) => feedStory.topic === currentNav)
						?.stories.map((story, index) => (
							<StoryPreview story={story} key={index} version="home" />
						))}
					{storyStore.skeletonLoading && <StorySkeletons />}
				</LeftContainer>

				<RightContainer></RightContainer>
			</MainConntainer>
		</div>
	);
};

export default HomePage;
