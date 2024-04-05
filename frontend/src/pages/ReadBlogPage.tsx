import { useParams } from "react-router-dom";
import { blogStore } from "../stores/blogStore";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import ProfileIcon from "../components/ProfileIcon";

type BlogType = {
	id?: string;
	title: string;
	content?: string;
	description: string;
	published?: boolean;
	postedOn?: string;
	topics: string[];
	author?: string;
	coverImage: string | File;
};

const ReadBlogPage = () => {
	const { id } = useParams<{ id: string }>();
	const BlogStore = blogStore();
	const [blog, setBlog] = useState<BlogType>();

	useEffect(() => {
		async function getBlog() {
			const res = await BlogStore.getBlog({ id: id || "" });
			setBlog(res);
			console.log(res);
		}

		getBlog();
	}, [id]);

	useEffect(() => {
		const content = document.getElementById("content") as HTMLTextAreaElement;
		content.style.height = `${content.scrollHeight}px`;
	}, [blog?.content])

	return (
		<div className="ReadBlogPage">
			<Header />

			<div className="main-container w-full h-screen max-w-3xl mx-auto pt-10">
				<p className="title px-2 pt-12 pb-3 text-4xl leading-[3rem] overflow-hidden font-Merriweather font-semibold">
					{blog?.title}
				</p>

				<div className="profile py-4 flex items-center text-sm">
					<ProfileIcon />
					<div className="info flex flex-col">
						<div className="user-name font-semibold">
							{blog?.author}{" "}
							<button type="button" className="text-blue-500 mx-4 font-bold">
								Follow
							</button>
						</div>
						<div className="publish-date">Feb, 10 2024</div>
					</div>
				</div>

				<div className="button-bar border-y border-slate-300 flex items-center gap-4 py-1 px-4 my-4">
					<button type="button" className="flex py-2 px-2 gap-2 text-gray-500">
						<svg width="24" height="24" viewBox="0 0 24 24" aria-label="clap">
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M11.37.83L12 3.28l.63-2.45h-1.26zM13.92 3.95l1.52-2.1-1.18-.4-.34 2.5zM8.59 1.84l1.52 2.11-.34-2.5-1.18.4zM18.52 18.92a4.23 4.23 0 0 1-2.62 1.33l.41-.37c2.39-2.4 2.86-4.95 1.4-7.63l-.91-1.6-.8-1.67c-.25-.56-.19-.98.21-1.29a.7.7 0 0 1 .55-.13c.28.05.54.23.72.5l2.37 4.16c.97 1.62 1.14 4.23-1.33 6.7zm-11-.44l-4.15-4.15a.83.83 0 0 1 1.17-1.17l2.16 2.16a.37.37 0 0 0 .51-.52l-2.15-2.16L3.6 11.2a.83.83 0 0 1 1.17-1.17l3.43 3.44a.36.36 0 0 0 .52 0 .36.36 0 0 0 0-.52L5.29 9.51l-.97-.97a.83.83 0 0 1 0-1.16.84.84 0 0 1 1.17 0l.97.97 3.44 3.43a.36.36 0 0 0 .51 0 .37.37 0 0 0 0-.52L6.98 7.83a.82.82 0 0 1-.18-.9.82.82 0 0 1 .76-.51c.22 0 .43.09.58.24l5.8 5.79a.37.37 0 0 0 .58-.42L13.4 9.67c-.26-.56-.2-.98.2-1.29a.7.7 0 0 1 .55-.13c.28.05.55.23.73.5l2.2 3.86c1.3 2.38.87 4.59-1.29 6.75a4.65 4.65 0 0 1-4.19 1.37 7.73 7.73 0 0 1-4.07-2.25zm3.23-12.5l2.12 2.11c-.41.5-.47 1.17-.13 1.9l.22.46-3.52-3.53a.81.81 0 0 1-.1-.36c0-.23.09-.43.24-.59a.85.85 0 0 1 1.17 0zm7.36 1.7a1.86 1.86 0 0 0-1.23-.84 1.44 1.44 0 0 0-1.12.27c-.3.24-.5.55-.58.89-.25-.25-.57-.4-.91-.47-.28-.04-.56 0-.82.1l-2.18-2.18a1.56 1.56 0 0 0-2.2 0c-.2.2-.33.44-.4.7a1.56 1.56 0 0 0-2.63.75 1.6 1.6 0 0 0-2.23-.04 1.56 1.56 0 0 0 0 2.2c-.24.1-.5.24-.72.45a1.56 1.56 0 0 0 0 2.2l.52.52a1.56 1.56 0 0 0-.75 2.61L7 19a8.46 8.46 0 0 0 4.48 2.45 5.18 5.18 0 0 0 3.36-.5 4.89 4.89 0 0 0 4.2-1.51c2.75-2.77 2.54-5.74 1.43-7.59L18.1 7.68z"
							></path>
						</svg>
						<span>89</span>
					</button>

					<button type="button" className="flex py-2 px-2 gap-2 text-gray-500">
						<svg width="24" height="24" viewBox="0 0 24 24" className="rp">
							<path d="M18 16.8a7.14 7.14 0 0 0 2.24-5.32c0-4.12-3.53-7.48-8.05-7.48C7.67 4 4 7.36 4 11.48c0 4.13 3.67 7.48 8.2 7.48a8.9 8.9 0 0 0 2.38-.32c.23.2.48.39.75.56 1.06.69 2.2 1.04 3.4 1.04.22 0 .4-.11.48-.29a.5.5 0 0 0-.04-.52 6.4 6.4 0 0 1-1.16-2.65v.02zm-3.12 1.06l-.06-.22-.32.1a8 8 0 0 1-2.3.33c-4.03 0-7.3-2.96-7.3-6.59S8.17 4.9 12.2 4.9c4 0 7.1 2.96 7.1 6.6 0 1.8-.6 3.47-2.02 4.72l-.2.16v.26l.02.3a6.74 6.74 0 0 0 .88 2.4 5.27 5.27 0 0 1-2.17-.86c-.28-.17-.72-.38-.94-.59l.01-.02z"></path>
						</svg>
						<span>19</span>
					</button>

					<div className="flex-1"></div>

					<button type="button" className="py-2 px-2 gap-2 text-gray-500">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="kj">
							<path
								d="M17.5 1.25a.5.5 0 0 1 1 0v2.5H21a.5.5 0 0 1 0 1h-2.5v2.5a.5.5 0 0 1-1 0v-2.5H15a.5.5 0 0 1 0-1h2.5v-2.5zm-11 4.5a1 1 0 0 1 1-1H11a.5.5 0 0 0 0-1H7.5a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-8.5a.5.5 0 0 0-1 0v7.48l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4V5.75z"
								fill="#000"
							></path>
						</svg>
					</button>

					<button type="button" className="py-2 px-2 gap-2 text-gray-500">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M4.39 12c0 .55.2 1.02.59 1.41.39.4.86.59 1.4.59.56 0 1.03-.2 1.42-.59.4-.39.59-.86.59-1.41 0-.55-.2-1.02-.6-1.41A1.93 1.93 0 0 0 6.4 10c-.55 0-1.02.2-1.41.59-.4.39-.6.86-.6 1.41zM10 12c0 .55.2 1.02.58 1.41.4.4.87.59 1.42.59.54 0 1.02-.2 1.4-.59.4-.39.6-.86.6-1.41 0-.55-.2-1.02-.6-1.41a1.93 1.93 0 0 0-1.4-.59c-.55 0-1.04.2-1.42.59-.4.39-.58.86-.58 1.41zm5.6 0c0 .55.2 1.02.57 1.41.4.4.88.59 1.43.59.57 0 1.04-.2 1.43-.59.39-.39.57-.86.57-1.41 0-.55-.2-1.02-.57-1.41A1.93 1.93 0 0 0 17.6 10c-.55 0-1.04.2-1.43.59-.38.39-.57.86-.57 1.41z"
								fill="currentColor"
							></path>
						</svg>
					</button>
				</div>

				{blog?.coverImage && (
					<div className="cover-img block mx-auto my-6 max-w-[80%] max-h-[1000px]">
						<img src={blog?.coverImage as string} alt="cover image" className="w-full" />
					</div>
				)}

				<textarea
					id="content"
					className="content w-full h-full px-2 pt-4 mb-20 text-xl overflow-hidden text-gray-900 font-Merriweather font-light leading-9 outline-none resize-none text-justify"
					value={blog?.content}
				/>
			</div>
		</div>
	);
};

export default ReadBlogPage;
