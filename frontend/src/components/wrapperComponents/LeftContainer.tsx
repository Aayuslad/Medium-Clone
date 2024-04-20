import { ReactNode } from "react";

const LeftContainer = ({ children }: { children: ReactNode }) => {
	return (
		<div className="LeftContainer flex-1 max-w-[100vw] px-4 sm:pr-5 lg:pr-8 border-r border-slate-200">
			{children}
		</div>
	);
};

export default LeftContainer;
