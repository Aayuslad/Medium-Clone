import { ReactNode } from "react";

const LeftContainer = ({ children }: { children: ReactNode }) => {
	return <div className="big-container flex-1 px-4 sm:pr-5 lg:pr-8 border-r-2 border-neutral-300">{children}</div>;
};

export default LeftContainer;
