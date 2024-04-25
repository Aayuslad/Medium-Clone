import { useEffect, useState } from "react";
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
	const [currentNav, setCurrentNav] = useState<string>("");
	const storyStore = StoryStore();
	const { nav } = useParams<{ nav: string }>();

	useEffect(() => {
		if (currentNav === "Saved stories" && storyStore.savedStories.length === 0)
			storyStore.getSavedStories();
	}, [currentNav]);

	useEffect(() => {
		if (currentNav === "Reading History" && storyStore.readingHistory.length === 0)
			storyStore.getReadingHistory();
	}, [currentNav]);

	useEffect(() => {
		setCurrentNav(nav || "Saved stories");
	}, []);

	return (
		<div className="LibraryPage">
			<Header />

			<MainConntainer>
				<LeftContainer>
					<h2 className="text-5xl font-semibold py-12">Your Library</h2>

					<RegularLeftContainerNavbar
						page="libray"
						navs={["Saved stories", "Reading History"]}
						currentNav={currentNav}
						setCurrentNav={setCurrentNav}
					/>

					{currentNav === "Saved stories" && !storyStore.skeletonLoading && (
						<>
							{storyStore.savedStories.map((story, index) => (
								<StoryPreview story={story} index={index} version="profile" />
							))}
						</>
					)}

					{currentNav === "Reading History" && !storyStore.skeletonLoading && (
						<>
							{storyStore.readingHistory.map((story, index) => (
								<StoryPreview story={story} index={index} version="profile" />
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
