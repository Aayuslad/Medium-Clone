const RefineRecomendationsSkelitons = () => {
	return (
		<div>
			<Skeliton />
			<Skeliton />
			<Skeliton />
			<Skeliton />
			<Skeliton />
			<Skeliton />
		</div>
	);
};

const Skeliton = () => {
	return (
		<div className="animate-pulse flex items-center my-6 lg:mr-20">
			<div className="profile">
				<svg
					className="w-12 h-12 me-3 text-gray-200 dark:text-gray-300"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
				</svg>
			</div>
			<div className="flex-1">
				<div className="h-3 w-32 bg-gray-200 rounded-full dark:bg-gray-300 my-2"></div>
				<div className="h-3 w-60 bg-gray-200 rounded-full dark:bg-gray-300 my-2"></div>
			</div>

			<div className="h-8 w-20 bg-gray-200 rounded-full dark:bg-gray-300 my-2"></div>
		</div>
	);
};

export default RefineRecomendationsSkelitons;
