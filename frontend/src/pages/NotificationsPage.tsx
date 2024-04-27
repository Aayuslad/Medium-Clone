import { useEffect, useState } from "react";
import Header from "../components/Header";
import LeftContainer from "../components/wrapperComponents/LeftContainer";
import MainConntainer from "../components/wrapperComponents/MainContainer";
import RightContainer from "../components/wrapperComponents/RightContainer";
import RegularLeftContainerNavbar from "../components/navbars/RegularLeftContainerNavbar";
import { useParams } from "react-router-dom";

const NotificationsPage = () => {
	const [currentNav, setCurrentNav] = useState<string>("All");
	const { nav } = useParams<{ nav: string }>();

	useEffect(() => {
		setCurrentNav(nav || "All");
	}, [nav]);

	return (
		<div className="RefineRecomendations">
			<Header />

			<MainConntainer>
				<LeftContainer>
					<h2 className=" text-[1.8rem]  sm:text-[2.5rem] font-semibold py-12">
						Notifications
					</h2>

					<RegularLeftContainerNavbar
						navs={["All", "Responses"]}
						currentNav={currentNav}
						setCurrentNav={setCurrentNav}
						page={"notifications"}
					/>
				</LeftContainer>
				<RightContainer>right</RightContainer>
			</MainConntainer>
		</div>
	);
};

export default NotificationsPage;
