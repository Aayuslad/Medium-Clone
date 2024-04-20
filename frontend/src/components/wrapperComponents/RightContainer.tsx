import { ReactNode } from "react";

const RightContainer = ({ children }: { children: ReactNode }) => {
	return (
		<div className="RightContainer w-[350px] min-w-[300px] h-fit min-h-screen hidden lg:block px-10 sticky top-0">
			{children}
		</div>
	);
};

export default RightContainer;
