import { useNavigate } from "react-router-dom";
import TopicFollowUnfollowButton from "./buttons/TopicFollowUnfollowButton";
import { topicType } from "@aayushlad/medium-clone-common";

export default function TopicPriview({ topic }: { topic: topicType }) {
	const navigate = useNavigate();

	return (
		<div className="flex pt-5 items-center gap-5">
			<div
				className="logo w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer"
				onClick={() => {
					navigate(`/topic/${topic.topic}`);
				}}
			>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="pd">
					<path
						d="M3 14V2h10v12H3zM2.75 1a.75.75 0 0 0-.75.75v12.5c0 .41.34.75.75.75h10.5c.41 0 .75-.34.75-.75V1.75a.75.75 0 0 0-.75-.75H2.75zM5 10.5a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zM4.5 9c0-.28.22-.5.5-.5h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm1.25-2.5h4.5c.14 0 .25-.11.25-.25v-1.5a.25.25 0 0 0-.25-.25h-4.5a.25.25 0 0 0-.25.25v1.5c0 .14.11.25.25.25z"
						fill="currentColor"
					></path>
				</svg>
			</div>

			<div className="flex-1 flex flex-col">
				<h3
					className="font-medium text-[17px] cursor-pointer"
					onClick={() => {
						navigate(`/topic/${topic.topic}`);
					}}
				>
					{topic.topic}
				</h3>
				<p>{topic.followersCount + " Followers" + " · " + topic.storiesCount + " Stories"}</p>
			</div>

			<TopicFollowUnfollowButton id={topic.id} topic={topic.topic} />
		</div>
	);
}
