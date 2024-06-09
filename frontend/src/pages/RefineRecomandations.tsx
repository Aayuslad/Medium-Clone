import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import LeftContainer from "../components/wrapperComponents/LeftContainer";
import MainConntainer from "../components/wrapperComponents/MainContainer";
import RightContainer from "../components/wrapperComponents/RightContainer";
import RegularLeftContainerNavbar from "../components/navbars/RegularLeftContainerNavbar";
import { useNavigate, useParams } from "react-router-dom";
import { UsersStore } from "../stores/usersStore";
import ProfileIcon from "../components/ProfileIcon";
import defaultProfile from "../assets/defaultProfile.jpg";
import BigFollowFollowingButton from "../components/buttons/BigFollowFollowingButton";
import AuthorMuteUnmuteButton from "../components/buttons/AuthorMuteUnmuteButton";
import TopicFollowUnfollowButton from "../components/buttons/TopicFollowUnfollowButton";
import RefineRecomendationsSkelitons from "../components/skelitons/RefineRecomendationsSkelitons";

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
							{usersStore.refineReconmandations?.Following.map((author) => {
								return (
									<div key={author.id} className="flex pt-8 items-center gap-5">
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
												{" · "}
												<span className="text-sm text-gray-700">
													{author.followersCount} {"  "}Followers
												</span>
											</div>
											<p className="text-sm text-gray-700 hidden sm:block">
												{author.bio}
											</p>
										</div>

										<BigFollowFollowingButton user={author} />
									</div>
								);
							})}
						</div>
					)}

					{currentNav === "Muted" && (
						<div className="lg:mr-20">
							{usersStore.refineReconmandations?.Muted.map((author) => {
								return (
									<div key={author.id} className="flex pt-8 items-center gap-4">
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
							{usersStore.refineReconmandations?.["Discover Authors"].map((author) => {
								return (
									<div key={author.id} className="flex pt-8 items-center gap-5">
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
												{" · "}
												<span className="text-sm text-gray-700">
													{author.followersCount} {"  "}Followers
												</span>
											</div>
											<p className="text-sm text-gray-700  sm:block">{author.bio}</p>
										</div>

										<BigFollowFollowingButton user={author} />
									</div>
								);
							})}
						</div>
					)}

					{currentNav === "Discover Topics" && (
						<div className="lg:mr-20">
							{usersStore.refineReconmandations?.["Discover Topics"].map((topic) => {
								return (
									<div key={topic.id} className="flex pt-5 items-center gap-5">
										<div
											className="logo w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer"
											onClick={() => {
												navigate(`/topic/${topic.topic}`);
											}}
										>
											<svg
												width="16"
												height="16"
												viewBox="0 0 16 16"
												fill="none"
												className="pd"
											>
												<path
													d="M3 14V2h10v12H3zM2.75 1a.75.75 0 0 0-.75.75v12.5c0 .41.34.75.75.75h10.5c.41 0 .75-.34.75-.75V1.75a.75.75 0 0 0-.75-.75H2.75zM5 10.5a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zM4.5 9c0-.28.22-.5.5-.5h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm1.25-2.5h4.5c.14 0 .25-.11.25-.25v-1.5a.25.25 0 0 0-.25-.25h-4.5a.25.25 0 0 0-.25.25v1.5c0 .14.11.25.25.25z"
													fill="currentColor"
												></path>
											</svg>
										</div>

										<div className="flex-1 flex flex-col">
											<h3
												className="font-medium text-[17px] cursor-pointer"
												onClick={() => {
													navigate(`/topic/${topic.topic}`);
												}}
											>
												{topic.topic}
											</h3>
											<p>
												{topic.followersCount +
													" Followers" +
													" · " +
													topic.storiesCount +
													" Stories"}
											</p>
										</div>

										<TopicFollowUnfollowButton id={topic.id} topic={topic.topic} />
									</div>
								);
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
