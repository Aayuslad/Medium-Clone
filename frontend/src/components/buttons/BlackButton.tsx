import React from "react";

interface ButtonProps {
	type: "submit" | "reset" | "button" | undefined;
	children: React.ReactNode;
}

export const BlackButton: React.FC<ButtonProps> = ({ type, children }) => {
	return (
		<div className="button w-80 max-w-full flex justify-center">
			<button type={type} className="bg-black text-white w-11/12 px-3 py-2 rounded-md">
				{children}
			</button>
		</div>
	);
};
