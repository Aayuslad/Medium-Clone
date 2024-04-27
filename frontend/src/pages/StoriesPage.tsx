import { useEffect, useState } from "react";
import Header from "../components/Header";
import LeftContainer from "../components/wrapperComponents/LeftContainer";
import MainConntainer from "../components/wrapperComponents/MainContainer";
import RightContainer from "../components/wrapperComponents/RightContainer";
import RegularLeftContainerNavbar from "../components/navbars/RegularLeftContainerNavbar";
import { useParams } from "react-router-dom";

const StoriesPage = () => {
	const [currentNav, setCurrentNav] = useState<string>("Drafts");
	const { nav } = useParams<{ nav: string }>();

	useEffect(() => {
		setCurrentNav(nav || "Drafts");
	}, [nav]);

	return (
		<div className="RefineRecomendations">
			<Header />

			<MainConntainer>
				<LeftContainer>
					<h2 className=" text-[1.8rem]  sm:text-[2.5rem] font-semibold py-12">Your stories</h2>

					<RegularLeftContainerNavbar
						navs={["Drafts", "Published", "Responses", "Spam"]}
						currentNav={currentNav}
						setCurrentNav={setCurrentNav}
						page={"stories"}
					/>
				</LeftContainer>
				<RightContainer>right</RightContainer>
			</MainConntainer>
		</div>
	);
};

export default StoriesPage;
