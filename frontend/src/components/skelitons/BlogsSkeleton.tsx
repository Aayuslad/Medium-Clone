const BlogsSkeliton = () => {
	return (
		<div
			role="status"
			className="blog border-b w-[700px] max-w-[90vw] mx-auto flex flex-col gap-2 border-gray-200 animate-pulse mt-6 pb-6 dark:border-gray-300"
		>
			<div className="post-header flex items-center w-full gap-2 py-2">
				<div className="profile">
					<svg
						className="w-8 h-8 me-3 text-gray-200 dark:text-gray-300"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
					</svg>
				</div>
				<div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-300 w-32"></div>
				<div className="flex-1"></div>
				<div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-300 w-20"></div>
			</div>

			<div className="body flex items-start gap-4 pt-2">
				<div className="left flex-1 max-w-[60vw] sm:pr-8">
					<div className="h-4 max-w-[55vw] bg-gray-200 rounded-full dark:bg-gray-300 mb-2.5"></div>
					<div className="h-4 max-w-[40vw] bg-gray-200 rounded-full dark:bg-gray-300 w-48 mb-5"></div>
					<div className="h-3 hidden sm:block bg-gray-200 rounded-full dark:bg-gray-300 mb-2.5"></div>
					<div className="h-3 hidden sm:block bg-gray-200 rounded-full dark:bg-gray-300 mb-2.5"></div>
					<div className="h-3 hidden sm:block bg-gray-200 rounded-full dark:bg-gray-300 w-72"></div>
				</div>
				<div className="right h-full">
					<div className="h-18 w-24 sm:h-20 sm:w-36 bg-gray-300 rounded dark:bg-gray-300">
						<svg
							className="w-10 h-10 text-gray-700 dark:text-gray-300"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							viewBox="0 0 16 20"
						>
							<path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
							<path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
						</svg>
					</div>
				</div>
			</div>
			<div className="flex gap-2 mt-5 sm:mr-52">
				<div className="h-7 bg-gray-200 rounded-full dark:bg-gray-300 w-32"></div>
				<div className="flex-1"></div>
				<div className="h-4 bg-gray-200 rounded-full dark:bg-gray-300 w-8 ml-auto"></div>
				<div className="h-4 bg-gray-200 rounded-full dark:bg-gray-300 w-8 ml-auto"></div>
				<div className="h-4 bg-gray-200 rounded-full dark:bg-gray-300 w-8 ml-auto"></div>
			</div>
		</div>
	);
};

export default BlogsSkeliton;
