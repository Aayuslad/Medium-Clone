import { useEffect, useState } from "react";
import Header from "../components/Header";
import LeftContainer from "../components/wrapperComponents/LeftContainer";
import MainConntainer from "../components/wrapperComponents/MainContainer";
import RightContainer from "../components/wrapperComponents/RightContainer";
import RegularLeftContainerNavbar from "../components/navbars/RegularLeftContainerNavbar";
import { useParams } from "react-router-dom";

const RefineRecommendations = () => {
	const [currentNav, setCurrentNav] = useState<string>("following");
	const { nav } = useParams<{ nav: string }>();

	useEffect(() => {
		setCurrentNav(nav || "Following");
	}, [nav])

	return (
		<div className="RefineRecomendations">
			<Header />

			<MainConntainer>
				<LeftContainer>
					<h2 className=" text-[1.8rem]  sm:text-[2.5rem] font-semibold pt-12">
						Refine recommendations
					</h2>
					<div className=" text-xs sm:text-sm text-gray-800 pt-2 pb-6">
						Adjust recommendations by updating what you’re following, your reading history, and
						who you’ve muted.
					</div>

					<RegularLeftContainerNavbar
						navs={["Following", "Muted", "Discover Authors", "Discover Topics"]}
						currentNav={currentNav}
						setCurrentNav={setCurrentNav}
						page={"refineRecommendations"}
					/>
				</LeftContainer>
				<RightContainer>right</RightContainer>
			</MainConntainer>
		</div>
	);
};

export default RefineRecommendations;
