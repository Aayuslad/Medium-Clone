import LibraryPageNavButton from "./buttons/LibraryPageNavButton";
import ProfileNavButton from "./buttons/ProfilePageNavButton";
import SignOutBtnWithEmail from "./buttons/SignOutBtnWithEmail";
import StoriesPageNavButton from "./buttons/StoriesPageNavButton";
import WriteBlogButton from "./buttons/WriteBlogButton";

const SideBar = () => {
	return (
		<div className="side-bar z-1 w-[250px] max-w-[300px] h-fit absolute top-[3.2rem] right-4 py-4 bg-white rounded custom-box-shadow">
			<div className=" md:hidden">
				<WriteBlogButton />
				<div className="border border-slate-200 my-4"></div>
			</div>

			<ProfileNavButton />

			<LibraryPageNavButton />

			<StoriesPageNavButton />

			<div className="border border-slate-200 my-4"></div>

			<SignOutBtnWithEmail />
		</div>
	);
};

export default SideBar;
