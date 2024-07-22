import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import RegularLeftContainerNavbar from "../components/navbars/RegularLeftContainerNavbar";
import RefineRecomendationsSkelitons from "../components/skelitons/RefineRecomendationsSkelitons";
import StorySkeletons from "../components/skelitons/StorySkeletons";
import StoryPreview from "../components/StoryPreview";
import TopicPriview from "../components/TopicPriview";
import UserOrPeoplePreview from "../components/UserOrPeoplePreview";
import LeftContainer from "../components/wrapperComponents/LeftContainer";
import MainContainer from "../components/wrapperComponents/MainContainer";
import RightContainer from "../components/wrapperComponents/RightContainer";
import { UsersStore } from "../stores/usersStore";

const SearchResultPage = () => {
	const mainContainerRef = useRef<HTMLDivElement | null>(null);
	const { nav, searchQuery } = useParams<{ nav: string; searchQuery: string }>();
	const [currentNav, setCurrentNav] = useState<string>(nav || "Stories");
	const [pageNumbers, setPageNumbers] = useState<{ [key: string]: number }>();
	const [isAllDataLoaded, setIsAllDataLoaded] = useState<{ [key: string]: Boolean }>({});
	const usersStore = UsersStore();

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
			case "Stories":
				if (usersStore.searchResultPage["stories"]?.length === currentPage * 8) {
					return;
				}
				if (!isAllDataLoaded?.["Stories"] && searchQuery)
					usersStore.getSerchResultPageStories({ searchQuery, currentPage, setIsAllDataLoaded });
				break;
			case "People":
				if (usersStore.searchResultPage["authors"]?.length === currentPage * 8) {
					return;
				}
				if (!isAllDataLoaded?.["People"] && searchQuery)
					usersStore.getSerchResultPageAuthors({ searchQuery, currentPage, setIsAllDataLoaded });
				break;
			case "Topics":
				if (usersStore.searchResultPage["topics"]?.length === currentPage * 8) {
					return;
				}
				if (!isAllDataLoaded?.["Topics"] && searchQuery)
					usersStore.getSerchResultPageTopics({ searchQuery, currentPage, setIsAllDataLoaded });
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
				!usersStore.skeletonLoading &&
				(isAllDataLoaded?.[currentNav] || true)
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
		<div className="SearchResultPage">
			<Header />

			<MainContainer ref={mainContainerRef}>
				<LeftContainer>
					<h2 className=" text-[1.8rem] mb-3 sm:text-[2.5rem] font-semibold pt-12">
						<span className="text-gray-500">Results for</span> {searchQuery}
					</h2>

					<RegularLeftContainerNavbar
						navs={["Stories", "People", "Topics"]}
						currentNav={currentNav}
						setCurrentNav={setCurrentNav}
						page={`SearchResult/${searchQuery}`}
					/>

					{currentNav === "Stories" && (
						<div>
							{usersStore.searchResultPage["stories"]?.map((story, index) => (
								<StoryPreview story={story} key={index} />
							))}
						</div>
					)}

					{currentNav === "Stories" && usersStore.skeletonLoading && <StorySkeletons />}

					{currentNav === "People" && (
						<div>
							{usersStore.searchResultPage["authors"]?.map((author, index) => (
								<UserOrPeoplePreview author={author} index={index} />
							))}
						</div>
					)}

					{currentNav === "Topics" && (
						<div>
							{usersStore.searchResultPage["topics"]?.map((topic, index) => (
								<TopicPriview index={index} topic={topic} />
							))}
						</div>
					)}

					{(currentNav === "People" || currentNav == "topics") && usersStore.skeletonLoading && (
						<RefineRecomendationsSkelitons />
					)}
				</LeftContainer>
				<RightContainer />
			</MainContainer>
		</div>
	);
};

export default SearchResultPage;
