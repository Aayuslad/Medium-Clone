import { useNavigate } from "react-router-dom";
import { storyType } from "@aayushlad/medium-clone-common";
import MoreOptions from "./buttons/MoreOptionsButton";
import SaveButton from "./buttons/SaveButton";
import { formatDate } from "../helper/formatDate";
import ClapsButton from "./buttons/ClapsButton";
import CommentsButton from "./buttons/CommentsButton";
import ProfileIcon from "./ProfileIcon";

type props = {
	story: storyType;
	index: number;
};

const SmallStoryPreview = ({ story, index }: props) => {
	const navigate = useNavigate();

	return (
		<div
			key={index}
			onClick={() => navigate(`/story/${story.id}`)}
			className="story mt-6 max-w-[340px] h-[380px] flex flex-wrap flex-col gap-3 cursor-pointer"
		>
			{story.coverImg && (
				<div className="cover-image w-full">
					<img
						className="max-w-full h-full max-h-[180px] block mx-auto"
						src={story.coverImg as string}
						alt="cover-image"
					/>
				</div>
			)}

			{!story.coverImg && (
				<div className="cover-image w-full h-[180px] bg-slate-200 flex items-center justify-center">
					Cover Image
				</div>
			)}

			<div className="story-body flex justify-around">
				<div className="content flex flex-col gap-2 ">
					<div className="title font-bold text-xl w-full">{story.title}</div>
				</div>
			</div>
			<div className="flex-1"></div>

			<div className="story-header flex gap-4">
				<div className="-mx-4">
					<ProfileIcon
						profileImg={story.author.profileImg}
						onClick={() => navigate(`/user/${story.author.id}/Home`)}
						heightWidth={6}
					/>
				</div>
				<div
					className="username"
					onClick={(e) => {
						e.stopPropagation();
						navigate(`/user/${story.author?.id}`);
					}}
				>
					{story.author?.userName}
				</div>
				<div className="flex-1"></div>
				<div className="realese-date">{formatDate(story.postedOn as string)}</div>
			</div>

			<div className="story-footer flex items-center">
				<div className="-ml-2">
					<ClapsButton storyId={story.id as string} totalClaps={story.clapsCount || 0} />
				</div>

				<CommentsButton responseCount={story.responseCount || 0} />

				<div className="flex-1"></div>

				<SaveButton storyId={story.id as string} />

				<div className="-mr-2">
					<MoreOptions />
				</div>
			</div>
		</div>
	);
};

export default SmallStoryPreview;
