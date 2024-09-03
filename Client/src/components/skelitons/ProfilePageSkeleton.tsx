import BlogsSkeliton from "./StorySkeleton";

const ProfilePageSkeleton = () => {
	return (
		<div role="status" className="main-container w-full max-w-6xl mx-auto mt-14 flex pt-6 px-2 ">
			<div className="big-container w-full flex-1 sm:pr-16 ">
				<div className="username font-semibold h-10 w-80 mt-8 mb-16 bg-gray-200 rounded-full dark:bg-gray-300"></div>
				<div className="flex">
					<div className="h-6 w-16 mx-3 bg-gray-200 rounded-full dark:bg-gray-300 mb-2.5"></div>
					<div className="h-6 w-16 bg-gray-200 rounded-full dark:bg-gray-300 mb-2.5"></div>
				</div>

				<div className="h-[0.1rem] w-full bg-gray-200 rounded-full dark:bg-gray-300 mb-2.5"></div>

				<div className="blogs lg:mr-10">
					<BlogsSkeliton />
					<BlogsSkeliton />
					<BlogsSkeliton />
					<BlogsSkeliton />
				</div>
			</div>

			<div className="small-container w-[350px] px-8 hidden lg:block h-screen sticky top-0">
				<div className="profile">
					<svg
						className="w-20 h-20 mt-4 mb-3 text-gray-200 dark:text-gray-300"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
					</svg>
					<div className="h-4 w-40 bg-gray-200 rounded-full dark:bg-gray-300 mt-5 mb-2.5"></div>
					<div className="h-3 w-32 bg-gray-200 rounded-full dark:bg-gray-300 mb-6"></div>
					<div className="h-2 w-full bg-gray-200 rounded-full dark:bg-gray-300 mb-2.5"></div>
					<div className="h-2 w-full bg-gray-200 rounded-full dark:bg-gray-300 mb-2.5"></div>
					<div className="h-2 w-32 bg-gray-200 rounded-full dark:bg-gray-300 mb-2.5"></div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePageSkeleton;
