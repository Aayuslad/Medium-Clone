import { useNavigate } from "react-router-dom";
import { AuthStore } from "../../stores/authStore";
import toast from "react-hot-toast";

const AddTopicButton = () => {
	const navigate = useNavigate();
	const authStore = AuthStore();

	const handleClick = () => {
		if (!authStore.user) {
			toast("Login to add topics");
			return;
		}
		navigate("/refineRecommendations/Discover%20Topics");
	};

	return (
		<button className="cursor-pointer" onClick={handleClick}>
			<svg width="19" height="19">
				<path d="M9 9H3v1h6v6h1v-6h6V9h-6V3H9v6z" fillRule="evenodd" />
			</svg>
		</button>
	);
};

export default AddTopicButton;
