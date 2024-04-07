const CrossCloseButton = ({
	type,
	onClick,
}: {
	type: "submit" | "button" | "reset" | undefined;
	onClick: () => void;
}) => {
	return (
		<button onClick={onClick} type={type}>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="dv dq dx dw">
				<path
					d="M5 5l7 7m7 7l-7-7m0 0l7-7m-7 7l-7 7"
					stroke="currentColor"
					strokeLinecap="round"
				></path>
			</svg>
		</button>
	);
};

export default CrossCloseButton;