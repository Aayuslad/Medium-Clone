import { useEffect, useState } from "react";
import { AuthStore } from "../../stores/authStore";
import { UsersStore } from "../../stores/usersStore";
import RegularButton from "./RegularButton";
import toast from "react-hot-toast";
import { userType } from "@aayushlad/medium-clone-common";

type props = {
	user: userType;
	setUser: React.Dispatch<React.SetStateAction<userType | undefined>>;
};

const BigFollowFollowingButton = ({ user, setUser }: props) => {
	const [isFollowing, setIsFollowing] = useState<boolean | undefined>(undefined);
	const usersStore = UsersStore();
	const authStore = AuthStore();

	useEffect(() => {
		if (user.id && authStore.user?.id === user.id) {
			setIsFollowing(undefined);
			return;
		}

		if (user.id && authStore.user?.following) {
			setIsFollowing(authStore.user?.following?.some((userId) => userId === user.id));
		}
	}, [user.id, authStore.user]);

	function onClickHandler() {
		if (!authStore.user) {
			toast.error("Signin to follow");
			return;
		}

		usersStore.followUser({ userIdToFollow: user.id as string });

		authStore.setUser({
			...authStore.user,
			following: isFollowing
				? (authStore.user.following || []).filter((userId) => userId !== user.id)
				: [...(authStore.user.following || []), user.id],
		});

		if (!isFollowing && user?.followersCount) {
			setUser({
				...user,
				followersCount: user.followersCount + 1,
			});
		} else if (isFollowing && user?.followersCount) {
			setUser({
				...user,
				followersCount: user.followersCount - 1,
			});

			setIsFollowing((state) => !state);
		}
	}

	return (
		<div className="follow -mx-1 sm:-mx-2 py-1 min-w-[90px]">
			{isFollowing !== undefined &&
				(!isFollowing ? (
					<RegularButton
						text="Follow"
						color="white"
						bgColor="green"
						borderColor="green"
						disabled={usersStore.buttonLoading}
						onClick={onClickHandler}
					/>
				) : (
					<RegularButton
						text="Unfollow"
						color="green"
						bgColor="white"
						borderColor="green"
						disabled={usersStore.buttonLoading}
						onClick={onClickHandler}
					/>
				))}
		</div>
	);
};

export default BigFollowFollowingButton;
