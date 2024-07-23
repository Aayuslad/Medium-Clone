import SearchBox from "../components/SearchBox";

export default function MobileGlobalSearchPage() {
	return (
		<div>
			<div className="serchbox w-full flex justify-center py-5 px-5">
				<SearchBox />
			</div>

			<div className="recentSearche px-3">
				<h2 className="text-xl font-semibold">Recent Searches</h2>
			</div>
		</div>
	);
}
