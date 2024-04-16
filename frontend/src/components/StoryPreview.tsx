import { useNavigate } from "react-router-dom";
import { storyType } from "@aayushlad/medium-clone-common";
import defaultProfile from "../assets/defaultProfile.jpg";
import MoreOptions from "./buttons/MoreOptionsButton";
import RemoveButton from "./buttons/RemoveButton";
import SaveButton from "./buttons/SaveButton";

const StoryPreview = ({ story, index }: { story: storyType; index: number }) => {
	const navigate = useNavigate();

	function formatDate(inputDate: string) {
		const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

		// Parse the input date string
		const date = new Date(inputDate);

		// Extract the components of the date
		const year = date.getFullYear();
		const month = months[date.getMonth()];
		const day = date.getDate();

		// Construct the formatted date string
		const formattedDate = `${month} ${day}, ${year}`;

		return formattedDate;
	}

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
						e.stopPropagation(); // Stops event propagation
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
						e.stopPropagation(); // Stops event propagation
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

				<div className="flex-1"></div>

				<SaveButton storyId={story.id as string} />

				<RemoveButton />

				<MoreOptions />
			</div>
		</div>
	);
};

export default StoryPreview;
