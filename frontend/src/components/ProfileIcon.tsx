import authStore from "../stores/authStore";
import defaultProfile from "../assets/defaultProfile.jpg"

const ProfileIcon = ({ onClick }: { onClick?: () => void }) => {
	const AuthStore = authStore();

	return (
		<div className="profile mx-4 w-9 h-9 p-0 cursor-pointer" onClick={onClick}>
			<img
				src={(AuthStore.user?.profileImg as string) || defaultProfile}
				alt="user profile"
				className="rounded-full"
			/>
		</div>
	);
};

export default ProfileIcon;
