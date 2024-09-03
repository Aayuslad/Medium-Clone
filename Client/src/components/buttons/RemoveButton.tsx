import toast from "react-hot-toast";
import { StoryStore } from "../../stores/storyStore";

const RemoveButton = ({ id }: { id: string }) => {
	const storyStore = StoryStore();

	return (
		<div
			className="show-less mx-2"
			onClick={(e) => {
				e.stopPropagation();
				storyStore.removeStoryFromFeed(id);
				toast.success("Noted. Fewer similar stories ahead..");
			}}
		>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="nt nu">
				<path
					d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8.25 12h7.5"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				></path>
			</svg>
		</div>
	);
};

export default RemoveButton;
