import { useNavigate } from "react-router-dom";

const AddTopicButton = () => {
	const navigate = useNavigate();

	return (
		<button
			className="cursor-pointer"
			onClick={() => navigate("/refineRecommendations/Discover%20Topics")}
		>
			<svg width="19" height="19">
				<path d="M9 9H3v1h6v6h1v-6h6V9h-6V3H9v6z" fillRule="evenodd" />
			</svg>
		</button>
	);
};

export default AddTopicButton;
