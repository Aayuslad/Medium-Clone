import { useNavigate } from "react-router-dom";
import authStore from "../../stores/authStore";

const ProfileNavButton = () => {
	const navigate = useNavigate();
	const AuthStore = authStore();

	return (
		<button
			className="profile text-black flex items-center gap-4 py-2 px-5 cursor-pointer"
			onClick={() => navigate(`/user/${AuthStore.user?.id}`)}
		>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
				<circle cx="12" cy="7" r="4.5" stroke="currentColor"></circle>
				<path
					d="M3.5 21.5v-4.34C3.5 15.4 7.3 14 12 14s8.5 1.41 8.5 3.16v4.34"
					stroke="currentColor"
					strokeLinecap="round"
				></path>
			</svg>

			<span className="text-black">Profile</span>
		</button>
	);
};

export default ProfileNavButton;
