import { useNavigate } from "react-router-dom";

const StoriesPageNavButton = () => {
	const navigate = useNavigate();

	return (
		<button className="Stories text-black flex items-center gap-4 py-2 px-5 cursor-pointer" onClick={() => navigate("/stories/Drafts")}>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
				<path
					d="M4.75 21.5h14.5c.14 0 .25-.11.25-.25V2.75a.25.25 0 0 0-.25-.25H4.75a.25.25 0 0 0-.25.25v18.5c0 .14.11.25.25.25z"
					stroke="currentColor"
				></path>
				<path d="M8 8.5h8M8 15.5h5M8 12h8" stroke="currentColor" strokeLinecap="round"></path>
			</svg>

			<span>Stories</span>
		</button>
	);
};

export default StoriesPageNavButton;
