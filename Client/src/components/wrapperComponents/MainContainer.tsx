import { ReactNode, forwardRef } from "react";

interface MainContainerProps {
	children: ReactNode;
}

const MainContainer = forwardRef<HTMLDivElement, MainContainerProps>(({ children }, ref) => {
	return (
		<div ref={ref} className="MainContainer w-full flex-1 max-w-6xl mx-auto mt-14 flex">
			{children}
		</div>
	);
});

export default MainContainer;
