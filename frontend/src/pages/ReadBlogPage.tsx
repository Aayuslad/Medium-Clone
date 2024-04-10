import { BlogType } from "@aayushlad/medium-clone-common";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import ProfileIcon from "../components/ProfileIcon";
import ClapsButton from "../components/buttons/ClapsButton";
import CommentsButton from "../components/buttons/CommentsButton";
import MoreOptions from "../components/buttons/MoreOptionsButton";
import SaveButton from "../components/buttons/SaveButton";
import { BlogStore } from "../stores/blogStore";
import ReadBlogPageSkeleton from "../components/skelitons/ReadBlogPageSkeleton";

const ReadBlogPage = () => {
	const { id } = useParams<{ id: string }>();
	const blogStore = BlogStore();
	const [blog, setBlog] = useState<BlogType>();

	// fetcing user data
	useEffect(() => {
		(async () => {
			const res = await blogStore.getBlog({ id: id || "" });
			setBlog(res);
		})();
	}, [id]);

	// abjusting heigh of textarea component
	useEffect(() => {
		const content = document.getElementById("content") as HTMLTextAreaElement;
		content.style.height = `${content.scrollHeight}px`;
	}, [blog?.content]);

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
		<div className="ReadBlogPage">
			<Header />

			{!blogStore.skelitonLoading && (
				<div className="main-container w-full h-screen px-2 max-w-3xl mx-auto pt-10">
					<p className="title px-2 pt-12 pb-3 overflow-hidden font-Merriweather font-semibold text-2xl leading-[2.2rem] sm:text-4xl sm:leading-[3rem]">
						{blog?.title}
					</p>

					<div className="profile py-4 flex items-center text-sm">
						<ProfileIcon />

						<div className="info flex flex-col">
							<div className="user-name font-semibold">
								{blog?.author?.name}{" "}
								<button type="button" className="text-blue-500 mx-4 font-bold">
									Follow
								</button>
							</div>
							<div className="publish-date">{formatDate(blog?.postedOn as string)}</div>
						</div>
					</div>

					<div className="button-bar border-y border-slate-300 flex items-center gap-4 py-1 px-4 my-4">
						<ClapsButton
							postId={blog?.id as string}
							claps={blog?.claps}
							totalClaps={blog?.totalClaps || 0}
						/>

						<CommentsButton />

						<div className="flex-1"></div>

						<SaveButton />

						<MoreOptions />
					</div>

					{blog?.coverImage && (
						<div className="cover-img block mx-auto my-6 max-w-[80%] max-h-[600px]">
							<img src={blog?.coverImage as string} alt="cover image" className="w-full" />
						</div>
					)}

					<textarea
						id="content"
						readOnly={true}
						className="content w-full h-full px-2 pt-4 mb-20 overflow-hidden text-gray-900 font-Merriweather font-light outline-none resize-none text-justify text-[1rem] sm:text-xl sm:leading-9"
						value={blog?.content}
					/>
				</div>
			)}

			{blogStore.skelitonLoading && <ReadBlogPageSkeleton />}
		</div>
	);
};

export default ReadBlogPage;
