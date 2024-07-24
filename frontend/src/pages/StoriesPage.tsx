import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import LeftContainer from "../components/wrapperComponents/LeftContainer";
import MainConntainer from "../components/wrapperComponents/MainContainer";
import RightContainer from "../components/wrapperComponents/RightContainer";
import RegularLeftContainerNavbar from "../components/navbars/RegularLeftContainerNavbar";
import { useParams } from "react-router-dom";
import { UsersStore } from "../stores/usersStore";
import { StoryStore } from "../stores/storyStore";
import { AuthStore } from "../stores/authStore";
import StoryDraftPreview from "../components/StoryDraftPreview";
import ResponseAndReplyPreview from "../components/ResponseAndReplyPreview";
import StoryDraftPreviewSkeleton from "../components/skelitons/StoryDraftPreviewSkeleton";
import ResponseAndReplyPreviewSkeleton from "../components/skelitons/ResponseAndReplyPreviewSkeleton";

const StoriesPage = () => {
	const { nav } = useParams<{ nav: string }>();
	const [currentNav, setCurrentNav] = useState<string>(nav || "Drafts");
	const mainContainerRef = useRef<HTMLDivElement | null>(null);
	const [pageNumbers, setPageNumbers] = useState<{ [key: string]: number }>();
	const [isAllDataLoaded, setIsAllDataLoaded] = useState<{ [key: string]: Boolean }>({});
	const usersStore = UsersStore();
	const storyStore = StoryStore();
	const authStore = AuthStore();

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
		const currentPage = pageNumbers?.[currentNav] || 1;

		//@ts-ignore
		if (storyStore.yourStoriesPage[currentNav]?.length === currentPage * 6) {
			return;
		}

		if (pageNumbers === undefined) return;

		switch (currentNav) {
			case "Drafts":
				if (!isAllDataLoaded?.[currentNav])
					storyStore.getUsersDrafts({ currentPage, setIsAllDataLoaded });
				break;

			case "Published":
				if (!isAllDataLoaded?.[currentNav])
					storyStore.getUserStories({
						userId: authStore.user?.id as string,
						currentPage,
						setIsAllDataLoaded,
					});
				break;

			case "Responses":
				if (!isAllDataLoaded?.[currentNav])
					storyStore.getUserResponses({ currentPage, setIsAllDataLoaded });
				break;

			case "Replies":
				if (!isAllDataLoaded?.[currentNav])
					storyStore.getUserReplies({ currentPage, setIsAllDataLoaded });
				break;

			case "Spam":
				if (!isAllDataLoaded?.[currentNav])
					// storyStore.getU({ currentPage, setIsAllDataLoaded });
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
		<div className="RefineRecomendations">
			<Header />

			<MainConntainer ref={mainContainerRef}>
				<LeftContainer>
					<h2 className=" text-[1.8rem]  sm:text-[2.5rem] font-semibold py-12">Your stories</h2>

					<RegularLeftContainerNavbar
						navs={["Drafts", "Published", "Responses", "Replies", "Spam"]}
						currentNav={currentNav}
						setCurrentNav={setCurrentNav}
						page={"stories"}
					/>

					{currentNav === "Drafts" && (
						<div className="lg:mr-20">
							{storyStore.yourStoriesPage.Drafts.map((draft) => (
								<StoryDraftPreview key={draft.id} draft={draft} />
							))}
						</div>
					)}

					{currentNav === "Published" && (
						<div className="lg:mr-20">
							{storyStore.yourStoriesPage.Published.map((draft) => (
								<StoryDraftPreview key={draft.id} draft={draft} />
							))}
						</div>
					)}

					{currentNav === "Responses" && (
						<div className="lg:mr-20">
							{storyStore.yourStoriesPage.Responses.map((response) => (
								<ResponseAndReplyPreview key={response.id} response={response} />
							))}
						</div>
					)}

					{currentNav === "Replies" && (
						<div className="lg:mr-20">
							{storyStore.yourStoriesPage.Replies.map((reply) => (
								<ResponseAndReplyPreview key={reply.id} reply={reply} />
							))}
						</div>
					)}

					{(currentNav === "Drafts" || currentNav === "Published") &&
						storyStore.skeletonLoading && <StoryDraftPreviewSkeleton />}

					{(currentNav === "Responses" || currentNav === "Replies") && storyStore.skeletonLoading && (
						<ResponseAndReplyPreviewSkeleton />
					)}
				</LeftContainer>
				<RightContainer>right</RightContainer>
			</MainConntainer>
		</div>
	);
};

export default StoriesPage;
