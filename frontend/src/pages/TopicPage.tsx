import Header from "../components/Header";
import MainConntainer from "../components/wrapperComponents/MainContainer";
import TopicFollowUnfollowButton from "../components/buttons/TopicFollowUnfollowButton";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { StoryStore } from "../stores/storyStore";

const TopicPage = () => {
	const { topic } = useParams<{ topic: string }>();
	const storyStore = StoryStore();

	useEffect(() => {
		(async function () {
			await storyStore.getTopic(topic as string);
		})();
	}, [topic]);

	return (
		<div className="TopicPage">
			<Header />

			<MainConntainer>
				{!storyStore.skelitonLoading && storyStore.topic && (
					<div className="w-full flex flex-col">
						<div className="header w-full flex flex-col gap-6 justify-center items-center py-20 border-b border-slate-200">
							<h1 className="font-bold text-5xl">{topic}</h1>
							<div>
								Topic - {storyStore.topic.followersCount} Followers -{" "}
								{storyStore.topic.storiesCount} stories
							</div>
							<TopicFollowUnfollowButton
								id={storyStore.topic.id}
								topic={storyStore.topic.topic}
							/>
						</div>
						<div className="stories w-full block  h-[1000px]">
							<h2 className="font-semibold text-3xl py-4">Recomended stories</h2>
							Stories related to this topic
						</div>
					</div>
				)}

				{storyStore.skelitonLoading && <div>skelitonLoading</div>}
			</MainConntainer>
		</div>
	);
};

export default TopicPage;
