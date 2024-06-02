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
	const { nav } = useParams<{ nav: string | undefined }>();
	const [currentNav, setCurrentNav] = useState<string>(nav || "For you");
	const [pageNumbers, setPageNumbers] = useState<{ [key: string]: number }>();
	const mainContainerRef = useRef<HTMLDivElement | null>(null);
	const [allStoriesLoaded, setAllStoriesLoaded] = useState<boolean>(false);

	useEffect(() => {
		if (nav === undefined) setCurrentNav("For you");
	}, [nav]);

	useEffect(() => {
		function updatepageNumbers() {
			setPageNumbers((prevPageNumbers) => ({
				...(prevPageNumbers || {}),
				[currentNav]: prevPageNumbers?.[currentNav] || 1,
			}));
		}

		updatepageNumbers();
	}, [currentNav]);

	// data fetching logic
	useEffect(() => {
		const existingTopics = storyStore.feedStories.map((story) => story.topic);
		const currentPage = pageNumbers?.[currentNav] || 1;

		if (
			storyStore.feedStories.find((story) => story.topic === currentNav)?.stories.length ===
			(pageNumbers?.[currentNav] || 0) * 5
		) {
			return;
		}

		if (storyStore.skeletonLoading) return;

		switch (currentNav) {
			case "For you":
				if (!allStoriesLoaded) storyStore.getStories(currentPage, setAllStoriesLoaded);
				break;

			case "Following":
				storyStore.getStoriesByAuthor({ currentPage });
				break;

			default:
				if (currentNav !== undefined && !existingTopics.includes(currentNav))
					storyStore.getStoriesByTopics({ topics: [currentNav], currentPage });
		}
	}, [pageNumbers]);

	// pagination logic
	const handleScroll = () => {
		if (mainContainerRef.current) {
			const mainContainer = mainContainerRef.current;
			const containerBottom = mainContainer.offsetTop + mainContainer.offsetHeight;
			const scrollPosition = window.pageYOffset + window.innerHeight;

			if (scrollPosition >= containerBottom - 1) {
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
						} duration-200 bg-white relative`}
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

				<RightContainer>
					Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam aspernatur odio illum ad
					reiciendis animi error itaque quis tenetur? Eum fugiat error omnis ducimus odio temporibus
					debitis ea quia, amet quo inventore. Odit reprehenderit fuga accusamus quis quos pariatur
					facere praesentium consequuntur quibusdam porro nulla ipsa, alias modi autem sapiente?
					Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolor, quia! Lorem ipsum dolor
					sit, amet consectetur adipisicing elit. Sit eligendi esse veniam accusamus autem
					reiciendis ullam provident iusto consectetur eveniet! Doloribus in cumque fugiat ipsum
					mollitia nostrum modi a inventore et dolorem. Consectetur eos, cupiditate eius, asperiores
					pariatur quos est sapiente ea illum tempore odit minima dolores dolore natus maxime
					officia, nesciunt repellendus tenetur porro! Unde repellendus tempore sit eaque temporibus
					autem odit libero magni! Aliquam iure nemo totam? Perspiciatis sint, nisi quis fugit
					fugiat amet. Voluptatibus quo, velit cum ad error sapiente totam, pariatur eligendi neque
					nulla consequuntur, sequi eum necessitatibus perspiciatis ex corrupti. Ex quaerat vero
					minima dolorum, incidunt, nemo nostrum, iure nihil voluptatem dolores quas quibusdam sed
					adipisci quia. Sunt vel et natus totam? Aperiam omnis voluptas ipsam consequatur illum
					ipsum sunt dolore velit? Magnam voluptates beatae obcaecati? Voluptatem cumque consectetur
					corrupti unde quis nemo velit sed necessitatibus dolore eos mollitia sit, libero,
					similique beatae quasi iusto numquam repudiandae voluptate provident consequatur fugit.
					Doloribus autem voluptates quas consectetur nulla totam quos odio. Quidem maiores quas
					aspernatur tempora, explicabo nisi sit? Sapiente quisquam perspiciatis, recusandae
					deserunt commodi fugiat error ipsa, dolorum eum fuga deleniti veritatis. Fugiat
					perspiciatis earum tenetur inventore quo? Excepturi natus mollitia vitae maiores magnam
					ratione.
				</RightContainer>
			</MainConntainer>
		</div>
	);
};

export default HomePage;
