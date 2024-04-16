import { useState } from "react";
import Header from "../components/Header";
import LeftContainer from "../components/wrapperComponents/LeftContainer";
import MainConntainer from "../components/wrapperComponents/MainContainer";
import RightContainer from "../components/wrapperComponents/RightContainer";
import RegularLeftContainerNavbar from "../components/navbars/RegularLeftContainerNavbar";

const LibraryPage = () => {
	const [currentNav, setCurrentNav] = useState("Saved stories");

	return (
		<div className="LibraryPage">
			<Header />

			<MainConntainer>
				<LeftContainer>
					<h2 className="text-5xl font-semibold py-12">Your Library</h2>

					<RegularLeftContainerNavbar
						navs={["Saved stories", "Reading History"]}
						currentNav={currentNav}
						setCurrentNav={setCurrentNav}
					/>
				</LeftContainer>
				<RightContainer>right</RightContainer>
			</MainConntainer>
		</div>
	);
};

export default LibraryPage;
