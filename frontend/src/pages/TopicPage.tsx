import Header from "../components/Header";
import MainConntainer from "../components/wrapperComponents/MainContainer";
import TopicFollowUnfollowButton from "../components/buttons/TopicFollowUnfollowButton";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { StoryStore } from "../stores/storyStore";
import StoryPreview from "../components/StoryPreview";
import SmallStoryPreview from "../components/SmallStoryPreview";

const TopicPage = () => {
	const { topic } = useParams<{ topic: string }>();
	const storyStore = StoryStore();

	useEffect(() => {
		(async function () {
			await storyStore.getTopic(topic as string);
		})();
		(async function () {
			await storyStore.getStoriesByTopics({ topics: [topic as string] });
		})();
	}, [topic]);

	return (
		<div className="TopicPage">
			<Header />

			<MainConntainer>
				{!storyStore.skeletonLoading && storyStore.topic && (
					<div className="w-full flex flex-col">
						<div className="header w-full flex flex-col gap-3 justify-center items-center py-20 border-b border-slate-200">
							<h1 className="font-bold text-3xl sm:text-5xl">{topic}</h1>
							<div>
								Topic - {storyStore.topic.followersCount} Followers -{" "}
								{storyStore.topic.storiesCount} stories
							</div>
							<TopicFollowUnfollowButton
								id={storyStore.topic.id}
								topic={storyStore.topic.topic}
							/>
						</div>
						<div className="stories w-full block h-[1000px] px-3 sm:px-4">
							<h2 className="font-semibold text-3xl py-4">Recomended stories</h2>
							<div className="stories md:hidden">
								{storyStore.feedStories
									.find((story) => story.topic === topic)
									?.stories.map((story) => (
										<StoryPreview key={story.id} story={story} version="profile" />
									))}
							</div>
							
							<div className="stories hidden md:flex flex-wrap items-stretch justify-around gap-x-8">
								{storyStore.feedStories
									.find((story) => story.topic === topic)
									?.stories.map((story, index) => (
										<SmallStoryPreview index={index} key={story.id} story={story} />
									))}
							</div>
						</div>
					</div>
				)}

				{storyStore.skeletonLoading && <div>skeletonLoading</div>}
			</MainConntainer>
		</div>
	);
};

export default TopicPage;
