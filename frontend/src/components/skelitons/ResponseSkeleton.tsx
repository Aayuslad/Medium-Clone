const ResponseSkeleton = () => {
	return (
		<div className="h-fit px-2 w-full border-b border-gray-200 animate-pulse mt-4 pb-4 dark:border-gray-300">
			<div className="flex items-center space-x-1.5">
				<div className="profile">
					<svg
						className="w-7 h-7 me-3 text-gray-200 dark:text-gray-300"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
					</svg>
				</div>
				<div className="flex flex-col gap-1">
					<div className="h-1.5 bg-gray-200 rounded-full dark:bg-gray-300 w-24"></div>
					<div className="h-1.5 bg-gray-200 rounded-full dark:bg-gray-300 w-16"></div>
				</div>
			</div>
			<div className="content flex flex-col gap-1.5 mt-4">
				<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-300 w-full"></div>
				<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-300 w-full"></div>
				<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-300 w-full"></div>
				<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-300 w-[60%]"></div>
			</div>
		</div>
	);
};

export default function App() {
	return (
		<>
			<ResponseSkeleton />
			<ResponseSkeleton />
			<ResponseSkeleton />
			<ResponseSkeleton />
		</>
	);
}
