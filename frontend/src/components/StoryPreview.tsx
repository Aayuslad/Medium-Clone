import { useNavigate } from "react-router-dom";
import { storyType } from "@aayushlad/medium-clone-common";
import defaultProfile from "../assets/defaultProfile.jpg";
import MoreOptions from "./buttons/MoreOptionsButton";
import RemoveButton from "./buttons/RemoveButton";
import SaveButton from "./buttons/SaveButton";
import { formatDate } from "../helper/formatDate";
import ClapsButton from "./buttons/ClapsButton";
import CommentsButton from "./buttons/CommentsButton";
import TopicButton from "./buttons/TopicButton";
import { useState } from "react";
import { UsersStore } from "../stores/usersStore";
import SmallFollowFollowingButton from "./buttons/SmallFollowFollowingButton";
import AuthorMuteUnmuteButton from "./buttons/AuthorMuteUnmuteButton";

type props = {
	story: storyType;
	version?: "home" | "profile";
};

const StoryPreview = ({ story, version = "home" }: props) => {
	const navigate = useNavigate();
	const usersStore = UsersStore();
	const [moreOptionsDropdown, setMoreOptionsDropdown] = useState<boolean>(false);

	return (
		<div
			onClick={() => navigate(`/story/${story.id}`)}
			className="story mt-6 border-b border-slate-5 max-w-[680px] sm:mx-auto lg:mx-0 lg:mr-auto flex flex-col gap-2 cursor-pointer"
		>
			<div className="story-header flex gap-4 py-2">
				<div
					className="profile w-7 h-7 p-0 cursor-pointer"
					onClick={(e) => {
						e.stopPropagation();
						navigate(`/user/${story.author?.id}/Home`);
					}}
				>
					<img
						src={(story.author?.profileImg as string) || defaultProfile}
						alt=""
						className="rounded-full"
					/>
				</div>
				<div
					className="username"
					onClick={(e) => {
						e.stopPropagation();
						navigate(`/user/${story.author?.id}/Home`);
					}}
				>
					{story.author?.userName}
				</div>
				<div className="flex-1"></div>
				<div className="realese-date">{formatDate(story.postedOn as string)}</div>
			</div>

			<div className="story-body flex justify-around">
				<div className="content pr-4  flex flex-col gap-2 sm:pr-10">
					<div className="title font-bold text-xl w-full text-left">{story.title}</div>

					<div className="description hidden sm:block">{story.description}</div>
				</div>

				{story.coverImg && (
					<div className="cover-image min-w-[50px] max-w-[100px] sm:min-w-[150px]">
						<img className="w-full block" src={story.coverImg as string} alt="cover-image" />
					</div>
				)}
			</div>

			<div className="story-footer flex items-center py-4 lg:pr-40">
				{version === "home" && (
					<div className="labels">
						{story.topics.map((topic, index) => {
							if (index > 0) return;

							return <TopicButton key={index} topic={topic} />;
						})}
					</div>
				)}

				{version === "profile" && (
					<ClapsButton storyId={story.id as string} totalClaps={story.clapsCount || 0} />
				)}

				{version === "profile" && (
					<CommentsButton
						responseCount={story.responseCount || 0}
						onClick={(e) => {
							e?.stopPropagation();
							navigate(`/story/${story.id}`, { state: { responseBox: true } });
						}}
					/>
				)}

				<div className="flex-1"></div>

				<SaveButton storyId={story.id as string} />

				{version === "home" && <RemoveButton id={story.id as string} />}

				<MoreOptions
					onClick={() => {
						setMoreOptionsDropdown((state) => !state);
					}}
				/>
				<div className="relative">
					{moreOptionsDropdown && (
						<div className="setMoreOptionsDropdown w-40 z-10 bg-white py-4 px-5 absolute -bottom-[145px] right-[0px] lg:right-[-60px] flex flex-col gap-2 custom-box-shadow rounded">
							<SmallFollowFollowingButton
								id={story.author.id}
								followButtonText="Follow author"
								unfollowButtonText="Unfollow author"
							/>
							<AuthorMuteUnmuteButton authorId={story.author.id} />
							<div className="text-red-700">Report Story...</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default StoryPreview;
