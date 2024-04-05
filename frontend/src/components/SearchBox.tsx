
const SearchBox = () => {
	return (
		<form className="serchBox itmes-center  gap-2 relative hidden md:flex">
			<div className="icon absolute h-full flex items-center left-3">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M4.1 11.06a6.95 6.95 0 1 1 13.9 0 6.95 6.95 0 0 1-13.9 0zm6.94-8.05a8.05 8.05 0 1 0 5.13 14.26l3.75 3.75a.56.56 0 1 0 .8-.79l-3.74-3.73A8.05 8.05 0 0 0 11.04 3v.01z"
						fill="currentColor"
					/>
				</svg>
			</div>
			<input
				type="text"
				placeholder="Search"
				className="bg-slate-100 px-4 py-2 pl-12 rounded-full w-70 outline-none"
			/>
		</form>
	);
};

export default SearchBox;
