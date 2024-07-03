import { useNavigate } from "react-router-dom";
import { StoryStore } from "../stores/storyStore";

const DraftDropDown = ({ storyId }: { storyId: string }) => {
	const navigate = useNavigate();
	const storyStore = StoryStore();

	return (
		<div className="dropdown w-[100px] absolute top-6 right-3 pr-7 py-3 px-4 rounded bg-white custom-box-shadow flex flex-col gap-2">
			<div
				className="text-gray-800 hover:text-black cursor-pointer"
				onClick={() => navigate(`/compose/${storyId}`)}
			>
				Edit{" "}
			</div>
			<div
				className="text-red-800 hover:text-black cursor-pointer"
				onClick={() => storyStore.deleteStory({ id: storyId })}
			>
				Delete{" "}
			</div>
		</div>
	);
};

export default DraftDropDown;
