import { useEffect, useState } from "react";

function useScrollDirection() {
	const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(null);

	useEffect(() => {
		let lastScrollY = window.scrollY;

		const updateScrollDirection = () => {
			const scrollY = window.scrollY;
			const direction = scrollY > lastScrollY ? "down" : "up";
			if (direction !== scrollDirection && Math.abs(scrollY - lastScrollY) > 4) {
				setScrollDirection(() => direction);
			}
			lastScrollY = scrollY > 0 ? scrollY : 0;
		};

		window.addEventListener("scroll", updateScrollDirection);
		return () => {
			window.removeEventListener("scroll", updateScrollDirection);
		};
	}, []);

	return scrollDirection;
}

export default useScrollDirection;
