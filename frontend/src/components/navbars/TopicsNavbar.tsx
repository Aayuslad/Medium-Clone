import React, { useEffect, useState, useRef } from "react";
import AddTopicButton from "../buttons/AddTopicbutton";
import { AuthStore } from "../../stores/authStore";
// import { StoryStore } from "../../stores/storyStore";
import { useNavigate } from "react-router-dom";

type Props = {
	currentNav: string;
	setCurrentNav: React.Dispatch<React.SetStateAction<string>>;
};

const TopicsNavbar = ({ currentNav, setCurrentNav }: Props) => {
	const [isAtStart, setIsAtStart] = useState(true);
	const [isAtEnd, setIsAtEnd] = useState(false);
	const navRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();
	const authStore = AuthStore();
	// const storyStore = StoryStore();

	const handleScroll = () => {
		if (navRef.current) {
			const target = navRef.current;
			setIsAtStart(target.scrollLeft === 0);
			console.log(target.scrollLeft + target.clientWidth, target.scrollWidth);

			setIsAtEnd(target.scrollLeft + target.clientWidth >= target.scrollWidth);
		}
	};

	useEffect(() => {
		const scrollContainer = navRef.current;
		if (scrollContainer) {
			scrollContainer.addEventListener("scroll", handleScroll as EventListener);
			return () => {
				scrollContainer.removeEventListener("scroll", handleScroll as EventListener);
			};
		}
	}, []);

	return (
		<div className="nav-container relative max-w-[680px]">
			<div
				ref={navRef}
				className="nav flex gap-9 border-b max-w-fit sm:max-w-full lg:w-full border-slate-200 pl-4 pr-10 overflow-x-scroll no-scrollbar duration-300"
			>
				<AddTopicButton />
				{[
					"For you",
					"Following",
					...(authStore.user?.followedTopics?.map((topic) => topic.topic) || []),
				].map((nav, index) => (
					<div
						key={index}
						onClick={() => {
							navigate(`/${nav}`);

							setCurrentNav(nav);

							// const existingTopics = storyStore.feedStories.map((story) => story.topic);

							// if (nav == "Following" && !existingTopics.includes(nav)) {
							// 	storyStore.getStoriesByAuthor();
							// 	return;
							// }

							// if (!existingTopics.includes(nav)) {
							// 	storyStore.getStoriesByTopics({ topics: [nav] });
							// }
						}}
						className={`cursor-pointer text-nowrap py-4 text-[14px] border-black ${
							currentNav === nav ? "border-b" : ""
						}`}
					>
						{nav}
					</div>
				))}
			</div>
			{!isAtStart && (
				<button
					className="left-button absolute left-0 py-3 pr-8 top-1/2 -translate-y-1/2 transition duration-300 left-white-box-shadow"
					onClick={() => {
						if (navRef.current) {
							navRef.current.scrollLeft -= 100;
						}
					}}
				>
					<svg width="26px" height="26px" viewBox="0 0 19 19">
						<path
							d="M11.47 13.97L6.99 9.48 11.47 5l.55.5-3.99 3.98 4 4z"
							fillRule="evenodd"
						></path>
					</svg>
				</button>
			)}
			{!isAtEnd && (
				<button
					className="right-button absolute py-3 pl-8 right-0 top-1/2 -translate-y-1/2 transition duration-300 right-white-box-shadow"
					onClick={() => {
						if (navRef.current) {
							navRef.current.scrollLeft += 100;
						}
					}}
				>
					<svg
						width="26px"
						height="26px"
						viewBox="0 0 19 19"
						style={{ transform: "rotate(180deg)" }}
					>
						<path
							d="M11.47 13.97L6.99 9.48 11.47 5l.55.5-3.99 3.98 4 4z"
							fillRule="evenodd"
						></path>
					</svg>{" "}
				</button>
			)}
		</div>
	);
};

export default TopicsNavbar;
