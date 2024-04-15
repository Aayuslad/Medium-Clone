import { storyType } from "@aayushlad/medium-clone-common";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import ProfileIcon from "../components/ProfileIcon";
import ClapsButton from "../components/buttons/ClapsButton";
import CommentsButton from "../components/buttons/CommentsButton";
import MoreOptions from "../components/buttons/MoreOptionsButton";
import SaveButton from "../components/buttons/SaveButton";
import { StoryStore } from "../stores/storyStore";
import ReadStoryPageSkeleton from "../components/skelitons/ReadStoryPageSkeleton";
import { FollowFollowingButton } from "../components/buttons/SmallFollowFollowingButton";

const ReadStoryPage = () => {
	const { id } = useParams<{ id: string }>();
	const storyStore = StoryStore();
	const [story, setStory] = useState<storyType>();
	const navigate = useNavigate();

	// fetcing data
	useEffect(() => {
		(async () => {
			if (!id) return;
			const res = await storyStore.getStory({ id });
			setStory(res);
		})();
	}, [id]);

	// abjusting heigh of textarea component
	useEffect(() => {
		const content = document.getElementById("content") as HTMLTextAreaElement;
		content.style.height = `${content.scrollHeight}px`;
	}, [story?.content]);

	// fuction for formating date.
	function formatDate(inputDate: string) {
		const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

		// Parse the input date string
		const date = new Date(inputDate);

		// Extract the components of the date
		const year = date.getFullYear();
		const month = months[date.getMonth()];
		const day = date.getDate();

		// Construct the formatted date string
		const formattedDate = `${month} ${day}, ${year}`;

		return formattedDate;
	}

	return (
		<div className="ReadStoryPage">
			<Header />

			{!storyStore.skelitonLoading && (
				<div className="main-container w-full h-screen px-2 max-w-3xl mx-auto pt-10">
					<p className="title px-2 pt-12 pb-3 overflow-hidden font-Merriweather font-semibold text-2xl leading-[2.2rem] sm:text-4xl sm:leading-[3rem]">
						{story?.title}
					</p>

					<div className="profile py-4 flex items-center text-sm">
						<ProfileIcon profileImg={story?.author.profileImg} onClick={() => navigate(`/user/${story?.author.id}`)}/>

						<div className="info flex flex-col">
							<div className="user-name font-semibold flex gap-3">
								{story?.author?.userName}
								<FollowFollowingButton id={story?.author.id as string} />
							</div>
							<div className="publish-date">{formatDate(story?.postedOn as string)}</div>
						</div>
					</div>

					<div className="button-bar border-y border-slate-300 flex items-center gap-4 py-1 px-4 my-4">
						<ClapsButton
							storyId={story?.id as string}
							claps={story?.claps}
							totalClaps={story?.clapsCount || 0}
						/>

						<CommentsButton />

						<div className="flex-1"></div>

						<SaveButton storyId={story?.id as string} />

						<MoreOptions />
					</div>

					{story?.coverImg && (
						<div className="cover-img block mx-auto my-6 max-w-[80%] max-h-[600px]">
							<img src={story?.coverImg as string} alt="cover image" className="w-full" />
						</div>
					)}

					<textarea
						id="content"
						readOnly={true}
						className="content w-full h-full px-2 pt-4 mb-20 overflow-hidden text-gray-900 font-Merriweather font-light outline-none resize-none text-justify text-[1rem] sm:text-xl sm:leading-9"
						value={story?.content}
					/>
				</div>
			)}

			{storyStore.skelitonLoading && <ReadStoryPageSkeleton />}
		</div>
	);
};

export default ReadStoryPage;
