import { AuthStore } from "../stores/authStore";
import defaultProfile from "../assets/defaultProfile.jpg";

const ProfileIcon = ({ onClick, profileImg }: { onClick?: () => void; profileImg?: string }) => {
	const authStore = AuthStore();

	return (
		<div className="profile mx-4 w-9 h-9 p-0 aspect-square cursor-pointer" onClick={onClick}>
			<img
				src={(profileImg ? profileImg : (authStore.user?.profileImg as string)) || defaultProfile}
				alt="user profile"
				className="rounded-full w-full h-full"
			/>
		</div>
	);
};

export default ProfileIcon;
