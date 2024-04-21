import { useEffect, useState } from "react";
import { AuthStore } from "../../stores/authStore";
import RegularButton from "./RegularButton";
import toast from "react-hot-toast";
import { StoryStore } from "../../stores/storyStore";

type props = {
	id: string;
	topic: string;
};

const TopicFollowUnfollowButton = ({ id, topic }: props) => {
	const [isFollowing, setIsFollowing] = useState<boolean>();
	const storyStore = StoryStore();
	const authStore = AuthStore();

	useEffect(() => {
		if (id && authStore.user?.followedTopics) {
			setIsFollowing(authStore.user?.followedTopics?.some((topic) => topic.id === id));
		}
	}, [id, authStore.user]);

	function onClickHandler() {
		if (!authStore.user) {
			toast.error("Signin to follow");
			return;
		}
		storyStore.followTopic({ topicId: id as string });
		authStore.setUser({
			...authStore.user,
			followedTopics: isFollowing
				? authStore.user.followedTopics.filter((topic) => topic.id !== id)
				: [...authStore.user.followedTopics, { id: id as string, topic: topic as string }],
		});
		if (!isFollowing && storyStore.topic) {
			storyStore.setTopic({
				...storyStore.topic,
				followersCount: storyStore.topic.followersCount + 1,
			});
		} else if (isFollowing && storyStore.topic) {
			storyStore.setTopic({
				...storyStore.topic,
				followersCount: storyStore.topic.followersCount - 1,
			});
		}
		setIsFollowing((state) => !state);
	}

	return (
		<div className="follow -mx-1 sm:-mx-2 py-1 min-w-[90px]">
			{!isFollowing ? (
				<RegularButton
					text="Follow"
					color="white"
					bgColor="black"
					borderColor="black"
					disabled={storyStore.buttonLoading}
					onClick={onClickHandler}
				/>
			) : (
				<RegularButton
					text="Unfollow"
					color="black"
					bgColor="white"
					borderColor="black"
					disabled={storyStore.buttonLoading}
					onClick={onClickHandler}
				/>
			)}
		</div>
	);
};

export default TopicFollowUnfollowButton;
