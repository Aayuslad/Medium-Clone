import { useState } from "react";
import Header from "../components/Header";
import RegularLeftContainerNavbar from "../components/navbars/RegularLeftContainerNavbar";
import LeftContainer from "../components/wrapperComponents/LeftContainer";
import MainContainer from "../components/wrapperComponents/MainContainer";
import RightContainer from "../components/wrapperComponents/RightContainer";
import { useParams } from "react-router-dom";

const SearchResultPage = () => {
	const { nav, searchQuery } = useParams<{ nav: string; searchQuery: string }>();
	const [currentNav, setCurrentNav] = useState<string>(nav || "Stories");

	return (
		<div className="SearchResultPage">
			<Header />

			<MainContainer>
				<LeftContainer>
					<h2 className=" text-[1.8rem] mb-3 sm:text-[2.5rem] font-semibold pt-12">
						<span className="text-gray-500">Results for</span> {searchQuery}
					</h2>

					<RegularLeftContainerNavbar
						navs={["Stories", "People", "Topics"]}
						currentNav={currentNav}
						setCurrentNav={setCurrentNav}
						page={`SearchResult/${searchQuery}`}
					/>

                    
				</LeftContainer>
				<RightContainer />
			</MainContainer>
		</div>
	);
};

export default SearchResultPage;
