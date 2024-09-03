import { useNavigate } from "react-router-dom";

const LibraryPageNavButton = () => {
	const navigation = useNavigate();

	return (
		<button
			className="library text-black flex items-center gap-4 py-2 px-5 cursor-pointer"
			onClick={() => navigation("/libray/Saved%20stories")}
		>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
				<path
					d="M6.44 6.69h0a1.5 1.5 0 0 1 1.06-.44h9c.4 0 .78.16 1.06.44l.35-.35-.35.35c.28.28.44.66.44 1.06v14l-5.7-4.4-.3-.23-.3.23-5.7 4.4v-14c0-.4.16-.78.44-1.06z"
					stroke="currentColor"
				></path>
				<path d="M12.5 2.75h-8a2 2 0 0 0-2 2v11.5" stroke="currentColor" strokeLinecap="round"></path>
			</svg>

			<span>Library</span>
		</button>
	);
};

export default LibraryPageNavButton;
