import { AuthStore } from "../stores/authStore";
import defaultProfile from "../assets/defaultProfile.jpg";

type props = {
	onClick?: () => void;
	profileImg?: string;
	heightWidth?: number;
};

const ProfileIcon = ({ onClick, profileImg, heightWidth = 9 }: props) => {
	const authStore = AuthStore();

	return (
		<div
			className={`profile mx-4 h-${heightWidth} w-${heightWidth} p-0 aspect-square cursor-pointer`}
			onClick={onClick}
		>
			<img
				src={(profileImg ? profileImg : (authStore.user?.profileImg as string)) || defaultProfile}
				alt="user profile"
				className="rounded-full w-full h-full"
			/>
		</div>
	);
};

export default ProfileIcon;
