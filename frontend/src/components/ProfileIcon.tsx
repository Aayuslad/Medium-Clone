import { AuthStore } from "../stores/authStore";
import defaultProfile from "../assets/defaultProfile.jpg";

type props = {
	marginX?: boolean;
	onClick?: () => void;
	profileImg?: string;
	heightWidth?: number;
};

const ProfileIcon = ({ onClick, profileImg, heightWidth, marginX = true }: props) => {
	const authStore = AuthStore();

	return (
		<div
			className={`profile ${marginX ? "mx-4" : "mx-0"}  ${"h-" + heightWidth || 9} ${
				"w-" + (heightWidth || 9)
			} ${
				"min-w-" + (heightWidth || 9)
			} p-0 rounded-full aspect-square flex items-center justify-center overflow-hidden cursor-pointer`}
			onClick={onClick}
		>
			<img
				src={(profileImg ? profileImg : (authStore.user?.profileImg as string)) || defaultProfile}
				alt="user profile"
				className="rounded-full w-full"
			/>
		</div>
	);
};

export default ProfileIcon;
