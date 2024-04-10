type propsType = {
	type?: "button" | "submit" | "reset" | undefined;
	text: string;
	bgColor?: string;
	color?: string;
	borderColor?: string;
	onClick?: () => void;
};

const RegularButton = ({ type, text, onClick, bgColor, color, borderColor }: propsType) => {
	return (
		<button
			type={type || "button"}
			className="bg-green-600 w-fit px-3 py-2 mx-1 rounded-3xl text-sm leading-4 text-white sm:mx-2 sm:px-4 sm:py-2"
			style={{
				backgroundColor: bgColor ? bgColor : "",
				color: color ? color : "",
				border: borderColor ?  `1px solid ${borderColor}` : "",
			}}
			onClick={onClick}
		>
			{text}
		</button>
	);
};

export default RegularButton;
