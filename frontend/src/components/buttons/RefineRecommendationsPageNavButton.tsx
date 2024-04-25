import { useNavigate } from "react-router-dom";

const RefineRecommendationsPageNavButton = () => {
	const navigate = useNavigate();

	return (
		<button className="px-6 py-1 cursor-pointer" onClick={() => navigate("/refineRecommendations/Following")}>
			Refine recommendations
		</button>
	);
};

export default RefineRecommendationsPageNavButton;
