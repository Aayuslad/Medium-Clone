import { ReactNode, useEffect } from "react";
import { AuthStore } from "../../stores/authStore";
import { UsersStore } from "../../stores/usersStore";
import RegularButton from "../buttons/RegularButton";
import TopicButton from "../buttons/TopicButton";
import ProfileIcon from "../ProfileIcon";
import defaultProfileImg from "../../assets/defaultProfile.jpg";
import BigFollowFollowingButton from "../buttons/BigFollowFollowingButton";
import { userType } from "@aayushlad/medium-clone-common";
import { useNavigate } from "react-router-dom";

const RightContainer = ({ children }: { children?: ReactNode }) => {
	const authStore = AuthStore();
	const usersStore = UsersStore();
	const navigate = useNavigate();

	useEffect(() => {
		if (authStore.user) {
			usersStore.getUserRecomendations({ userId: authStore.user.id });
		} else {
			usersStore.getUserRecomendations({});
		}
	}, []);

	return (
		<div className="RightContainer w-[350px] min-w-[300px] h-fit min-h-screen hidden lg:block pl-8 pr-2 sticky top-0 ">
			{children ? (
				children
			) : (
				<div className="flex flex-col gap-8 py-6">
					<div className="recommendedTopics">
						<h3 className="font-semibold mb-4 text-lg">Recommended Topics</h3>
						{usersStore.userRecomendations.recommendedTopics.map((topic) => {
							return <TopicButton key={topic.topic} topic={topic.topic} />;
						})}
					</div>

					<div className="blueBox bg-blue-200 px-4 py-4 flex flex-col gap-2 rounded custom-box-shadow">
						<h3 className="font-semibold">Writing On Medium</h3>
						<div className="py-3 text-lg">
							<q>Explore a platform to create, share, and discover inspiring stories.</q>
						</div>
						<RegularButton text="Start Writing" color="black" bgColor="white" onClick={() => {}} />
					</div>

					<div className="whoToFollow">
						<h3 className="font-semibold mb-4 text-lg">Who to follow</h3>
						{usersStore.userRecomendations.whoToFollow.map((author) => {
							return (
								<div className="flex gap-3 items-start py-2 justify-between" key={author.id}>
									<ProfileIcon
										profileImg={author.profileImg || defaultProfileImg}
										heightWidth={8}
										marginX={false}
									/>
									<div className="flex-1 ">
										<div className="font-semibold">{author.userName}</div>
										{author.bio && (
											<div className="text-xs">
												{author.bio.length > 50 ? `${author.bio.slice(0, 50)}...` : author.bio}
											</div>
										)}
									</div>
									<BigFollowFollowingButton user={author as userType} />
								</div>
							);
						})}
					</div>

					<div className="recentlySaved">
						<h3 className="font-semibold mb-4 text-lg">Recently Saved</h3>
						{usersStore.userRecomendations.recentlySaved.map((story) => {
							return (
								<div
									className="flex flex-col gap-3 items-start py-2 justify-between cursor-pointer"
									key={story.id}
									onClick={() => navigate(`/story/${story.id}`)}
								>
									<div className="author flex gap-3 items-center">
										<ProfileIcon
											profileImg={story.authorProfileImg || defaultProfileImg}
											heightWidth={6}
											marginX={false}
										/>
										<div className="font-semibold">{story.author}</div>
									</div>
									<div className="storybody font-bold ">{story.title}</div>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};

export default RightContainer;
