import { useNavigate } from "react-router-dom";
import { storyType } from "@aayushlad/medium-clone-common";
import defaultProfile from "../assets/defaultProfile.jpg";
import MoreOptions from "./buttons/MoreOptionsButton";
import RemoveButton from "./buttons/RemoveButton";
import SaveButton from "./buttons/SaveButton";
import { formatDate } from "../helper/formatDate";
import ClapsButton from "./buttons/ClapsButton";
import CommentsButton from "./buttons/CommentsButton";

type props = {
	story: storyType;
	index: number;
	version?: "home" | "profile";
};

const StoryPreview = ({ story, index, version = "home" }: props) => {
	const navigate = useNavigate();

	return (
		<div
			key={index}
			onClick={() => navigate(`/story/${story.id}`)}
			className="story mt-6 border-b border-slate-5 max-w-[680px] sm:mx-auto lg:mx-0 lg:mr-auto flex flex-col gap-2 cursor-pointer"
		>
			<div className="story-header flex gap-4 py-2">
				<div
					className="profile w-7 h-7 p-0 cursor-pointer"
					onClick={(e) => {
						e.stopPropagation();
						navigate(`/user/${story.author?.id}`);
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
						navigate(`/user/${story.author?.id}`);
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

							return (
								<span
									key={index}
									className="label bg-slate-100 px-3 py-2 mr-2 rounded-2xl text-xs inline-block mb-2"
								>
									{topic}
								</span>
							);
						})}
					</div>
				)}

				{version === "profile" && (
					<ClapsButton storyId={story.id as string} totalClaps={story.clapsCount || 0} />
				)}

				{version === "profile" && <CommentsButton />}

				<div className="flex-1"></div>

				<SaveButton storyId={story.id as string} />

				{version === "home" && <RemoveButton id={story.id as string} />}

				<MoreOptions />
			</div>
		</div>
	);
};

export default StoryPreview;
