import LibraryPageNavButton from "./buttons/LibraryPageNavButton";
import ProfilePageNavButton from "./buttons/ProfilePageNavButton";
import SignOutBtnWithEmail from "./buttons/SignOutBtnWithEmail";
import StoriesPageNavButton from "./buttons/StoriesPageNavButton";
import WriteStoryButton from "./buttons/WriteStoryButton";

const SideBar = () => {
	
	return (
		<div className="side-bar z-1 w-[250px] max-w-[300px] h-fit absolute top-[3.2rem] right-4 py-4 bg-white rounded custom-box-shadow">
			<div className=" md:hidden">
				<WriteStoryButton />
				<div className="border border-slate-200 my-4"></div>
			</div>

			<ProfilePageNavButton />

			<LibraryPageNavButton />

			<StoriesPageNavButton />

			<div className="border border-slate-200 my-4"></div>

			<SignOutBtnWithEmail />
		</div>
	);
};

export default SideBar;
