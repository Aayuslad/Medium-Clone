import { useNavigate } from "react-router-dom";

type props = {
	navs: string[];
	currentNav: string;
	setCurrentNav: React.Dispatch<React.SetStateAction<string>>;
	page: string;
};

const RegularLeftContainerNavbar = ({ navs, currentNav, page, setCurrentNav }: props) => {
	const navigate = useNavigate();

	return (
		<div className="nav flex gap-6 border-b border-slate-200 px-4 lg:mr-20 overflow-x-auto no-scrollbar">
			{navs.map((nav, index) => {
				return (
					<div
						key={index}
						onClick={() => {
							setCurrentNav(nav);
							navigate(`/${page}/${nav}`);
						}}
						className={`cursor-pointer py-3 text-[14px] text-nowrap border-black ${
							currentNav === `${nav}` ? "border-b" : ""
						} border-black`}
					>
						{nav}
					</div>
				);
			})}
		</div>
	);
};

export default RegularLeftContainerNavbar;
