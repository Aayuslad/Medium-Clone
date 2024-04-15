import { useEffect, useState } from "react";
import { StoryStore } from "../../stores/storyStore";
import { AuthStore } from "../../stores/authStore";

type props = {
	storyId: string;
};

const SaveButton = ({ storyId }: props) => {
	const storyStore = StoryStore();
	const authStore = AuthStore();
	const [alredySaved, setAlredySaved] = useState<boolean>(false);

	useEffect(() => {
		if (authStore.user?.savedStories && storyId)
			setAlredySaved(authStore.user.savedStories.some((save) => save === storyId));
	}, [authStore.user, storyId]);

	return (
		<button
			className="save mx-2"
			type="button"
			onClick={(e) => {
				e.stopPropagation();

				if (storyStore.putStoryLoading) {
					return;
				}

				storyStore.saveStory({ storyId });

				if (!authStore.user) {
					return;
				}

				setAlredySaved((state) => !state);
			}}
		>
			{!alredySaved && (
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="kj">
					<path
						d="M17.5 1.25a.5.5 0 0 1 1 0v2.5H21a.5.5 0 0 1 0 1h-2.5v2.5a.5.5 0 0 1-1 0v-2.5H15a.5.5 0 0 1 0-1h2.5v-2.5zm-11 4.5a1 1 0 0 1 1-1H11a.5.5 0 0 0 0-1H7.5a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-8.5a.5.5 0 0 0-1 0v7.48l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4V5.75z"
						fill="#000"
					></path>
				</svg>
			)}

			{alredySaved && (
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="yy">
					<path
						d="M7.5 3.75a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-14a2 2 0 0 0-2-2h-9z"
						fill="#000"
					></path>
				</svg>
			)}
		</button>
	);
};

export default SaveButton;
