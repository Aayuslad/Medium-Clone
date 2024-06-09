import { useEffect, useState } from "react";
import { AuthStore } from "../../stores/authStore";
import { UsersStore } from "../../stores/usersStore";
import toast from "react-hot-toast";

type props = {
	id: string;
	colorfull?: boolean;
	followButtonText?: string;
	unfollowButtonText?: string;
};

const SmallFollowFollowingButton = ({ id, colorfull, followButtonText, unfollowButtonText }: props) => {
	const [isFollowing, setIsFollowing] = useState<boolean | undefined>(undefined);
	const usersStore = UsersStore();
	const authStore = AuthStore();

	useEffect(() => {
		if (id && authStore.user?.id === id) {
			setIsFollowing(undefined);
			return;
		}

		if (id && authStore.user?.following) {
			setIsFollowing(authStore.user.following.some((userId) => userId === id));
		}
	}, [id, authStore.user]);

	function onClickHandler(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		e.stopPropagation();

		if (!authStore.user) {
			toast.error("Signin to follow");
			return;
		}

		usersStore.followUser({ userIdToFollow: id as string });
		setIsFollowing((state) => !state);
	}

	return (
		<div className="follow">
			{isFollowing !== undefined &&
				(!isFollowing ? (
					<button
						className={`${colorfull ? "text-green-600" : "text-black"}`}
						disabled={usersStore.buttonLoading}
						onClick={onClickHandler}
					>
						{followButtonText ? followButtonText : "Follow"}
					</button>
				) : (
					<button
						className={`${colorfull ? "text-red-600" : "text-black"}`}
						disabled={usersStore.buttonLoading}
						onClick={onClickHandler}
					>
						{unfollowButtonText ? unfollowButtonText : "Unfollow"}
					</button>
				))}
			{isFollowing === undefined && (
				<button
					className={`${colorfull ? "text-red-600" : "text-black"}`}
					disabled={usersStore.buttonLoading}
					onClick={(e) => {
						e.stopPropagation();
						if (id && authStore.user?.id === id) toast.error("You cannot follow yourself");
						else toast.error("signin to follow");
					}}
				>
					{followButtonText ? followButtonText : "Follow"}
				</button>
			)}
		</div>
	);
};

export default SmallFollowFollowingButton;
