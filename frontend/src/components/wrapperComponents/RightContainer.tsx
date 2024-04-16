import { ReactNode } from "react";

const RightContainer = ({ children }: { children: ReactNode }) => {
	return (
		<div className="RightContainer w-[350px] hidden lg:block px-10 min-h-screen sticky top-0">
			{children}
		</div>
	);
};

export default RightContainer;
