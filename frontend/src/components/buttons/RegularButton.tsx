const RegularButton = ({
	type,
	text,
	onClick,
	bgColor,
	color,
}: {
	type?: "button" | "submit" | "reset" | undefined;
	text: string;
	onClick: () => void;
	bgColor?: string;
	color?: string;
}) => {
	return (
		<button
			type={type || "button"}
			className="bg-green-600 px-3 py-2 mx-1 rounded-2xl text-sm leading-4 text-white sm:mx-2 sm:px-4 sm:py-2"
			style={{ backgroundColor: bgColor ? bgColor : "", color: color ? color : "" }}
			onClick={onClick}
		>
			{text}
		</button>
	);
};

export default RegularButton;
