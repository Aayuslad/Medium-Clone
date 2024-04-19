import { useEffect, useState } from "react";
import Header from "../components/Header";
import LeftContainer from "../components/wrapperComponents/LeftContainer";
import MainConntainer from "../components/wrapperComponents/MainContainer";
import RightContainer from "../components/wrapperComponents/RightContainer";
import RegularLeftContainerNavbar from "../components/navbars/RegularLeftContainerNavbar";
import { StoryStore } from "../stores/storyStore";
import StoryPreview from "../components/StoryPreview";
import BlogsSkelitons from "../components/skelitons/StorySkeletons";

const LibraryPage = () => {
	const [currentNav, setCurrentNav] = useState("Saved stories");
	const storyStore = StoryStore();

	useEffect(() => {
		if (storyStore.savedStories.length === 0) storyStore.getSavedStories();
	}, []);

	useEffect(() => {
		if (currentNav === "Reading History" && storyStore.readingHistory.length === 0) {
			console.log("run");
			storyStore.getReadingHistory();
		}
	}, [currentNav]);

	return (
		<div className="LibraryPage">
			<Header />

			<MainConntainer>
				<LeftContainer>
					<h2 className="text-5xl font-semibold py-12">Your Library</h2>

					<RegularLeftContainerNavbar
						navs={["Saved stories", "Reading History"]}
						currentNav={currentNav}
						setCurrentNav={setCurrentNav}
					/>

					{currentNav === "Saved stories" && !storyStore.skelitonLoading && (
						<>
							{storyStore.savedStories.map((story, index) => (
								<StoryPreview story={story} index={index} />
							))}
						</>
					)}

					{currentNav === "Reading History" && !storyStore.skelitonLoading && (
						<>
							{storyStore.readingHistory.map((story, index) => (
								<StoryPreview story={story} index={index} />
							))}
						</>
					)}

					{storyStore.skelitonLoading && <BlogsSkelitons />}
				</LeftContainer>
				<RightContainer>right</RightContainer>
			</MainConntainer>
		</div>
	);
};

export default LibraryPage;
