import { ReactNode } from "react";

const MainConntainer = ({ children }: { children: ReactNode }) => {
	return (
		<div className="MainContainer w-full flex-1 max-w-6xl mx-auto mt-14 flex border border-black">
			{children}
		</div>
	);
};

export default MainConntainer;
