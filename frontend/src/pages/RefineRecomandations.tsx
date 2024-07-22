import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import defaultProfile from "../assets/defaultProfile.jpg";
import AuthorMuteUnmuteButton from "../components/buttons/AuthorMuteUnmuteButton";
import Header from "../components/Header";
import RegularLeftContainerNavbar from "../components/navbars/RegularLeftContainerNavbar";
import ProfileIcon from "../components/ProfileIcon";
import RefineRecomendationsSkelitons from "../components/skelitons/RefineRecomendationsSkelitons";
import TopicPriview from "../components/TopicPriview";
import UserOrPeoplePreview from "../components/UserOrPeoplePreview";
import LeftContainer from "../components/wrapperComponents/LeftContainer";
import MainConntainer from "../components/wrapperComponents/MainContainer";
import RightContainer from "../components/wrapperComponents/RightContainer";
import { UsersStore } from "../stores/usersStore";

const RefineRecommendations = () => {
	const { nav } = useParams<{ nav: string }>();
	const [currentNav, setCurrentNav] = useState<string>(nav || "following");
	const mainContainerRef = useRef<HTMLDivElement | null>(null);
	const [pageNumbers, setPageNumbers] = useState<{ [key: string]: number }>();
	const [isAllDataLoaded, setIsAllDataLoaded] = useState<{ [key: string]: Boolean }>({});
	const usersStore = UsersStore();
	const navigate = useNavigate();

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

		//@ts-ignore
		if (usersStore.refineReconmandations[currentNav]?.length === currentPage * 12) {
			return;
		}

		if (pageNumbers === undefined) return;

		console.log(isAllDataLoaded);

		switch (currentNav) {
			case "Following":
				if (!isAllDataLoaded?.["Following"])
					usersStore.getUserFollowingAuthors({ currentPage, setIsAllDataLoaded });
				break;
			case "Muted":
				if (!isAllDataLoaded?.["Muted"])
					usersStore.getUserMutedAuthors({ currentPage, setIsAllDataLoaded });
				break;
			case "Discover Authors":
				if (!isAllDataLoaded?.["Discover Authors"])
					usersStore.getRandomAuthors({ currentPage, setIsAllDataLoaded });
				break;
			case "Discover Topics":
				if (!isAllDataLoaded?.["Discover Topics"])
					usersStore.getRandomTopics({ currentPage, setIsAllDataLoaded });
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
		<div className="RefineRecomendations">
			<Header />

			<MainConntainer ref={mainContainerRef}>
				<LeftContainer>
					<h2 className=" text-[1.8rem]  sm:text-[2.5rem] font-semibold pt-12">
						Refine recommendations
					</h2>
					<div className=" text-xs sm:text-sm text-gray-800 pt-2 pb-6">
						Adjust recommendations by updating what you’re following, your reading history, and
						who you’ve muted.
					</div>

					<RegularLeftContainerNavbar
						navs={["Following", "Muted", "Discover Authors", "Discover Topics"]}
						currentNav={currentNav}
						setCurrentNav={setCurrentNav}
						page={"refineRecommendations"}
					/>

					{currentNav === "Following" && (
						<div className="lg:mr-20">
							{usersStore.refineReconmandations?.Following.map((author, index) => {
								return <UserOrPeoplePreview index={index} author={author} />;
							})}
						</div>
					)}

					{currentNav === "Muted" && (
						<div className="lg:mr-20">
							{usersStore.refineReconmandations?.Muted.map((author, index) => {
								return (
									<div key={index} className="flex pt-8 items-center gap-4">
										<ProfileIcon
											marginX={false}
											profileImg={author.profileImg || defaultProfile}
											onClick={() => navigate(`/user/${author.id}/Home`)}
											heightWidth={10}
										/>

										<div className="flex-1">
											<div className="flex items-center gap-2">
												<h3 className="font-medium text-[17px]">
													{author.userName || "MediumUser"}
												</h3>
												<span className="text-sm ">
													{" · "}
													{author.followersCount} Followers
												</span>
											</div>
											<p className="text-sm text-gray-700 hidden sm:block">
												{author.bio}
											</p>
										</div>

										<AuthorMuteUnmuteButton authorId={author.id} buttonSize="lg" />
									</div>
								);
							})}
						</div>
					)}

					{currentNav === "Discover Authors" && (
						<div className="lg:mr-20">
							{usersStore.refineReconmandations?.["Discover Authors"].map((author, index) => {
								return <UserOrPeoplePreview index={index} author={author} />;
							})}
						</div>
					)}

					{currentNav === "Discover Topics" && (
						<div className="lg:mr-20">
							{usersStore.refineReconmandations?.["Discover Topics"].map((topic, index) => {
								return <TopicPriview index={index} topic={topic} />;
							})}
						</div>
					)}

					{usersStore.skeletonLoading && <RefineRecomendationsSkelitons />}
				</LeftContainer>
				<RightContainer>right</RightContainer>
			</MainConntainer>
		</div>
	);
};

export default RefineRecommendations;
