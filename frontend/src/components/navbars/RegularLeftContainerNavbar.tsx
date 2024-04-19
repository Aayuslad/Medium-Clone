type props = {
	navs: string[];
	currentNav: string;
	setCurrentNav: React.Dispatch<React.SetStateAction<string>>;
};

const RegularLeftContainerNavbar = ({ navs, currentNav, setCurrentNav }: props) => {
	return (
		<div className="nav flex gap-6 border-b border-slate-200 px-4 lg:mr-20">
			{navs.map((nav, index) => {
				return (
					<div
						key={index}
						onClick={() => setCurrentNav(`${nav}`)}
						className={`cursor-pointer py-3 text-[14px] border-black ${
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
