import { AuthStore } from "../stores/authStore";
import defaultProfile from "../assets/defaultProfile.jpg";

type props = {
	marginX?: boolean;
	onClick?: () => void;
	profileImg?: string;
	heightWidth?: number;
};

const ProfileIcon = ({ onClick, profileImg, heightWidth = 9, marginX = true }: props) => {
	const authStore = AuthStore();

	return (
		<div
			className={`profile ${marginX ? "mx-4" : "mx-0"}  h-${heightWidth} w-${heightWidth} p-0 aspect-square cursor-pointer`}
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
