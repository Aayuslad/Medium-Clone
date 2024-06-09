import { storyType, userType } from "@aayushlad/medium-clone-common";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import ProfileIcon from "../components/ProfileIcon";
import ResponseBox from "../components/ResponseBox";
import BigFollowFollowingButton from "../components/buttons/BigFollowFollowingButton";
import ClapsButton from "../components/buttons/ClapsButton";
import CommentsButton from "../components/buttons/CommentsButton";
import MoreOptions from "../components/buttons/MoreOptionsButton";
import SaveButton from "../components/buttons/SaveButton";
import SmallFollowFollowingButton from "../components/buttons/SmallFollowFollowingButton";
import TopicButton from "../components/buttons/TopicButton";
import ReadStoryPageSkeleton from "../components/skelitons/ReadStoryPageSkeleton";
import { formatDate } from "../helper/formatDate";
import { StoryStore } from "../stores/storyStore";

const ReadStoryPage = () => {
	const { id } = useParams();
	const storyStore = StoryStore();
	const [story, setStory] = useState<storyType | undefined>(undefined);
	const [author, setAuthor] = useState<userType>();
	const [responseBox, setResponseBox] = useState<boolean>(false);
	const [responseCount, setResponseCount] = useState<number>(0);
	const navigate = useNavigate();
	const { state } = useLocation();

	// Opening response box if response box button is clicked on story preview
	useEffect(() => {
		if (state && state.responseBox) setResponseBox(state.responseBox);
	}, [state]);

	// fetcing data
	useEffect(() => {
		(async () => {
			if (!id) return;
			const res = await storyStore.getStory({ id });
			setStory(res);
			setAuthor(res?.author as userType);
			setResponseCount(res?.responseCount || 0);
		})();
	}, [id]);

	return (
		<div className="ReadStoryPage h-fit">
			<Header />

			{(story !== undefined || !storyStore.skeletonLoading) && (
				<div className="main-container w-full h-fit px-2 max-w-3xl mx-auto pt-10">
					<p className="title px-2 pt-12 pb-3 overflow-hidden font-Merriweather font-semibold text-2xl leading-[2.2rem] sm:text-4xl sm:leading-[3rem]">
						{story?.title}
					</p>

					<div className="profile py-4 flex items-center text-sm">
						<ProfileIcon
							profileImg={story?.author.profileImg}
							onClick={() => navigate(`/user/${story?.author.id}/Home`)}
						/>

						<div className="info flex flex-col">
							<div className="user-name font-semibold flex gap-3">
								{story?.author?.userName}
								<SmallFollowFollowingButton id={story?.author.id as string} colorfull={true} />
							</div>
							<div className="publish-date">{formatDate(story?.postedOn as string)}</div>
						</div>
					</div>

					<div className="button-bar border-y border-slate-300 flex items-center gap-4 py-1 px-4 my-4">
						<ClapsButton
							storyId={story?.id as string}
							totalClaps={story?.clapsCount || 0}
							setStory={setStory}
						/>

						<CommentsButton
							onClick={() => setResponseBox((state) => !state)}
							responseCount={responseCount}
						/>

						<div className="flex-1"></div>

						<SaveButton storyId={story?.id as string} />

						<MoreOptions onClick={() => {}}/>
					</div>

					{story?.coverImg && (
						<div className="cover-img block mx-auto my-6 max-w-[80%] max-h-[600px]">
							<img src={story?.coverImg as string} alt="cover image" className="w-full" />
						</div>
					)}

					<pre className="content w-full text-wrap px-2 pt-4 mb-20 overflow-hidden text-gray-900 font-Merriweather font-light outline-none resize-none text-justify text-[1rem] sm:text-xl leading-[1.6rem] sm:leading-[2rem] break-words">
						{story?.content}
					</pre>

					<div className="story-small-footer">
						<div className="topics">
							{story?.topics.map((topic, index) => {
								return <TopicButton key={index} topic={topic} />;
							})}
						</div>

						<div className="button-bar flex items-center gap-4 py-1 px-4 my-4">
							<ClapsButton
								storyId={story?.id as string}
								totalClaps={story?.clapsCount || 0}
								setStory={setStory}
							/>

							<CommentsButton
								onClick={() => setResponseBox((state) => !state)}
								responseCount={story?.responseCount || 0}
							/>

							<div className="flex-1"></div>

							<SaveButton storyId={story?.id as string} />

							<MoreOptions onClick={() => {}} />
						</div>
					</div>
				</div>
			)}

			{(story !== undefined || !storyStore.skeletonLoading) && (
				<div className="page-footer bg-gray-100 mt-20">
					<div className="main-container w-full h-fit px-4 max-w-3xl mx-auto py-10">
						<div className="flex items-center justify-between">
							<ProfileIcon
								profileImg={story?.author.profileImg}
								onClick={() => navigate(`/user/${story?.author.id}/Home`)}
								heightWidth={20}
							/>
							<div className="block sm:hidden">
								{author && (
									<BigFollowFollowingButton user={author as userType} setUser={setAuthor} />
								)}
							</div>
						</div>

						<div className="flex mt-4 ">
							<div className="flex-1">
								<h2 className="text-2xl font-semibold">
									Written by {story?.author.userName}
								</h2>
								<div>
									{author?.followersCount}
									{author?.followersCount === 1 ? " Follower" : " Followers"}
								</div>
								<div className="mt-3">{story?.author.bio}</div>
							</div>
							<div className="hidden sm:block">
								<BigFollowFollowingButton user={author as userType} setUser={setAuthor} />
							</div>
						</div>
					</div>
				</div>
			)}

			{(storyStore.skeletonLoading || !story) && <ReadStoryPageSkeleton />}

			<ResponseBox
				responseBox={responseBox}
				authorName={story?.author.userName as string}
				responseCount={responseCount}
				storyId={story?.id as string}
				setResponseCount={setResponseCount}
				setResponseBox={setResponseBox}
			/>
		</div>
	);
};

export default ReadStoryPage;
