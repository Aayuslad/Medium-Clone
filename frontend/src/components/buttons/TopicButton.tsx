import { useNavigate } from "react-router-dom";

const TopicButton = ({ topic, index }: { topic: string; index: number }) => {
	const navigate = useNavigate();

	return (
		<div
			key={index}
			className="label bg-slate-100 px-3 py-2 mr-2 rounded-2xl text-xs inline-block mb-2 cursor-pointer"
			onClick={(e) => {
				e.stopPropagation();

				navigate(`/topic/${topic}`);
			}}
		>
			{topic}
		</div>
	);
};

export default TopicButton;
