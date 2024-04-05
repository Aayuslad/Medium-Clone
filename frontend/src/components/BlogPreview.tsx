import { useNavigate } from "react-router-dom";

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

const BlogPreview = ({ blog, index }: { blog: BlogType; index: number }) => {
	const navigate = useNavigate();

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
		<div
			key={index}
			onClick={() => navigate(`/blog/${blog.id}`)}
			className="blog mt-6 border-b border-slate-5 mx-4 flex flex-col gap-2 lg:mx-10 lg:mr-20 cursor-pointer"
		>
			<div className="post-header flex gap-4 py-2">
				<div className="profile w-7 h-7 p-0 cursor-pointer">
					<img
						src="https://miro.medium.com/v2/resize:fill:40:40/0*ks_bPGCSfXq0nrDO"
						alt=""
						className="rounded-full"
					/>
				</div>
				<div className="username">{blog.author}</div>
				<div className="flex-1"></div>
				<div className="realese-date">{formatDate(blog.postedOn as string)}</div>
			</div>

			<div className="post-body flex justify-around">
				<div className="content pr-4  flex flex-col gap-2 sm:pr-10">
					<div className="title font-bold text-xl w-full text-left">{blog.title}</div>

					<div className="description hidden sm:block">{blog.description}</div>
				</div>

				{blog.coverImage && (
					<div className="cover-image min-w-[50px] max-w-[100px] sm:min-w-[150px]">
						<img className="w-full block" src={blog.coverImage as string} alt="cover-image" />
					</div>
				)}
			</div>

			<div className="post-footer flex py-4 lg:pr-40">
				<div className="labels">
					{blog.topics.map((topic, index) => {
						if (index > 0) return;

						return (
							<span
								key={index}
								className="label bg-slate-100 px-3 py-2 mr-2 rounded-2xl text-xs inline-block mb-2"
							>
								{topic}
							</span>
						);
					})}
				</div>

				<div className="flex-1"></div>

				<div className="save mx-2">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="kj">
						<path
							d="M17.5 1.25a.5.5 0 0 1 1 0v2.5H21a.5.5 0 0 1 0 1h-2.5v2.5a.5.5 0 0 1-1 0v-2.5H15a.5.5 0 0 1 0-1h2.5v-2.5zm-11 4.5a1 1 0 0 1 1-1H11a.5.5 0 0 0 0-1H7.5a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-8.5a.5.5 0 0 0-1 0v7.48l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4V5.75z"
							fill="#000"
						></path>
					</svg>
				</div>

				<div className="show-less mx-2">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="nt nu">
						<path
							d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8.25 12h7.5"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>
					</svg>
				</div>

				<div className="more mx-2">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M4.39 12c0 .55.2 1.02.59 1.41.39.4.86.59 1.4.59.56 0 1.03-.2 1.42-.59.4-.39.59-.86.59-1.41 0-.55-.2-1.02-.6-1.41A1.93 1.93 0 0 0 6.4 10c-.55 0-1.02.2-1.41.59-.4.39-.6.86-.6 1.41zM10 12c0 .55.2 1.02.58 1.41.4.4.87.59 1.42.59.54 0 1.02-.2 1.4-.59.4-.39.6-.86.6-1.41 0-.55-.2-1.02-.6-1.41a1.93 1.93 0 0 0-1.4-.59c-.55 0-1.04.2-1.42.59-.4.39-.58.86-.58 1.41zm5.6 0c0 .55.2 1.02.57 1.41.4.4.88.59 1.43.59.57 0 1.04-.2 1.43-.59.39-.39.57-.86.57-1.41 0-.55-.2-1.02-.57-1.41A1.93 1.93 0 0 0 17.6 10c-.55 0-1.04.2-1.43.59-.38.39-.57.86-.57 1.41z"
							fill="currentColor"
						></path>
					</svg>
				</div>
			</div>
		</div>
	);
};

export default BlogPreview;