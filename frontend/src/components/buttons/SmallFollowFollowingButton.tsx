import { useEffect, useState } from "react";
import { AuthStore } from "../../stores/authStore";
import { UsersStore } from "../../stores/usersStore";
import toast from "react-hot-toast";

type props = {
	id: string;
};

export const FollowFollowingButton = ({ id }: props) => {
	const [isFollowing, setIsFollowing] = useState<boolean>();
	const usersStore = UsersStore();
	const authStore = AuthStore();

	useEffect(() => {
		if (id && authStore.user?.following) {
			setIsFollowing(authStore.user?.following?.some((userId) => userId === id));
		}
	}, [id, authStore.user]);

	function onClickHandler() {
		if (!authStore.user) {
			toast.error("Signin to follow");
			return;
		}
		usersStore.followUser({ userIdToFollow: id as string });
		setIsFollowing((state) => !state);
	}

	return (
		<div className="follow">
			{!isFollowing ? (
				<button
					className="text-green-600"
					disabled={usersStore.buttonLoading}
					onClick={onClickHandler}
				>
					Follow
				</button>
			) : (
				<button
					className="text-green-600"
					disabled={usersStore.buttonLoading}
					onClick={onClickHandler}
				>
					Unfollow
				</button>
			)}
		</div>
	);
};
