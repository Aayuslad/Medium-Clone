const ResponseAndReplyPreviewSkeleton = () => {
	return (
		<div className="animate-pulse">
			<SubSkeleton />
			<SubSkeleton />
			<SubSkeleton />
			<SubSkeleton />
			<SubSkeleton />
		</div>
	);
};

const SubSkeleton = () => {
	return (
		<div className="blog border-b w-[700px] max-w-[90vw] lg:mr-20 mx-auto flex flex-col gap-2 border-gray-200 animate-pulse mt-6 pb-6 dark:border-gray-300">
			<div className="body flex items-start gap-4 pt-4">
				<div className="left flex-1 max-w-[60vw] sm:pr-8">
					<div className="h-4 hidden sm:block bg-gray-200 rounded-full dark:bg-gray-300 mb-2.5"></div>
					<div className="h-4 hidden sm:block bg-gray-200 rounded-full dark:bg-gray-300 w-72"></div>
				</div>
			</div>
		</div>
	);
};

export default ResponseAndReplyPreviewSkeleton;
