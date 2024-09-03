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
		setCurrentNav(nav || "Stories");
	}, [nav]);

	// update the page numbers of the stories
	useEffect(() => {
		const contentItems = usersStore.searchResultPage[currentNav as keyof typeof usersStore.searchResultPage];
		if (contentItems.length > 0) {
			if (contentItems.length < 8) {
				setIsAllDataLoaded((prevIsAllDataLoaded) => ({
					...(prevIsAllDataLoaded || {}),
					[currentNav]: true,
				}));
				return;
			}
			const pageNumber = contentItems.length / 8;
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
	}, [currentNav]);

	// reset results when search query changes after mount
	useEffect(() => {
		setPageNumbers(undefined);
		const currentPage = pageNumbers?.[currentNav] || 1;
		usersStore.resetSearchResultPage();
		switch (currentNav) {
			case "Stories":
				if (searchQuery) usersStore.getSerchResultPageStories({ searchQuery, currentPage, setIsAllDataLoaded });
				break;
			case "People":
				if (searchQuery) usersStore.getSerchResultPageAuthors({ searchQuery, currentPage, setIsAllDataLoaded });
				break;
			case "Topics":
				if (searchQuery) usersStore.getSerchResultPageTopics({ searchQuery, currentPage, setIsAllDataLoaded });
				break;
		}
	}, [searchQuery]);

	//  fetching serch results on mount
	useEffect(() => {
		const currentPage = pageNumbers?.[currentNav] || 1;

		if (usersStore.searchResultPage[currentNav as keyof typeof usersStore.searchResultPage]?.length === currentPage * 8) {
			return;
		}

		if (pageNumbers === undefined) return;

		if (searchQuery === undefined) return;

		switch (currentNav) {
			case "Stories":
				if (!isAllDataLoaded?.["Stories"])
					usersStore.getSerchResultPageStories({ searchQuery, currentPage, setIsAllDataLoaded });
				break;
			case "People":
				if (!isAllDataLoaded?.["People"])
					usersStore.getSerchResultPageAuthors({ searchQuery, currentPage, setIsAllDataLoaded });
				break;
			case "Topics":
				if (!isAllDataLoaded?.["Topics"])
					usersStore.getSerchResultPageTopics({ searchQuery, currentPage, setIsAllDataLoaded });
				break;
		}
	}, [pageNumbers, searchQuery]);

	// pagination logic
	const handleScroll = () => {
		if (mainContainerRef.current) {
			const mainContainer = mainContainerRef.current;
			const containerBottom = mainContainer.offsetTop + mainContainer.offsetHeight;
			const scrollPosition = window.pageYOffset + window.innerHeight;

			if (
				scrollPosition >= containerBottom - 100 &&
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
							{usersStore.searchResultPage.Stories?.map((story, index) => (
								<StoryPreview story={story} key={index} />
							))}

							{!usersStore.skeletonLoading && usersStore.searchResultPage.Stories.length === 0 && (
								<div className="flex justify-center items-center h-80 ">
									<p className="text-center text-gray-600 text-[1.2rem]">
										Hmm, no matches here. Could you try different keywords
										<br />
										or review your spelling?
									</p>
								</div>
							)}
						</div>
					)}

					{currentNav === "Stories" && usersStore.skeletonLoading && <StorySkeletons />}

					{currentNav === "People" && (
						<div>
							{usersStore.searchResultPage.People?.map((author, index) => (
								<UserOrPeoplePreview author={author} key={index} />
							))}

							{!usersStore.skeletonLoading && usersStore.searchResultPage.People.length === 0 && (
								<div className="flex justify-center items-center h-80 ">
									<p className="text-center text-gray-600 text-[1.2rem]">
										Hmm, no matches here. Could you try different keywords
										<br />
										or review your spelling?{" "}
									</p>
								</div>
							)}
						</div>
					)}

					{currentNav === "Topics" && (
						<div>
							{usersStore.searchResultPage.Topics?.map((topic, index) => (
								<TopicPriview key={index} topic={topic} />
							))}

							{!usersStore.skeletonLoading && usersStore.searchResultPage.Topics.length === 0 && (
								<div className="flex justify-center items-center h-80 ">
									<p className="text-center text-gray-600 text-[1.2rem]">
										Hmm, no matches here. Could you try different keywords
										<br />
										or review your spelling?{" "}
									</p>
								</div>
							)}
						</div>
					)}

					{(currentNav === "People" || currentNav == "Topics") && usersStore.skeletonLoading && (
						<RefineRecomendationsSkelitons />
					)}
				</LeftContainer>
				<RightContainer />
			</MainContainer>
		</div>
	);
};

export default SearchResultPage;
