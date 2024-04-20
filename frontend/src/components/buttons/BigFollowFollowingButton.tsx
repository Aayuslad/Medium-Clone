import { useEffect, useState } from "react";
import { AuthStore } from "../../stores/authStore";
import { UsersStore } from "../../stores/usersStore";
import RegularButton from "./RegularButton";
import toast from "react-hot-toast";

type props = {
	id: string;
};

const BigFollowFollowingButton = ({ id }: props) => {
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
		<div className="follow -mx-1 sm:-mx-2 py-1 min-w-[90px]">
			{!isFollowing ? (
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
			)}
		</div>
	);
};

export default BigFollowFollowingButton;