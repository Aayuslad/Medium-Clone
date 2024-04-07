import SearchBox from "./SearchBox";
import MobileSearchButton from "./buttons/MobileSearchButton";
import RegularButton from "./buttons/RegularButton";
import WriteBlogButton from "./buttons/WriteBlogButton";
import authStore from "../stores/authStore";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import useScrollDirection from "../hooks/useScrollDirection";
import NotificationButton from "./buttons/NotificationButton";
import ProfileIcon from "./ProfileIcon";
import SideBar from "./SideBar";
import { useEffect, useState } from "react";

const Header = () => {
	const [sideBarState, setSideBarState] = useState<boolean>(false);
	const AuthStore = authStore();
	const navigate = useNavigate();
	const scrollDirection = useScrollDirection();

	useEffect(() => {
		setSideBarState(false)
	}, [scrollDirection])

	return (
		<div
			className={`Header z-10 w-full h-14 px-5 fixed flex items-center gap-1 border-b-2 border-neutral-300 bg-white backdrop-blur-20 duration-500 ${
				scrollDirection === "down" ? "-top-24" : "top-0"
			}`}
		>
			{/* Medium logo */}
			<button className="logo cursor-pointer" onClick={() => navigate("/")}>
				<img src={logo} className="App-logo w-10 h-10" alt="logo" />
			</button>

			{/* Search Box */}
			<SearchBox />

			<div className="flex-1"></div>

			{/* Serch botton for mobile */}
			<MobileSearchButton />

			{/* Sign up button */}
			{!AuthStore.isLoggedIn && <RegularButton text={"Sign up"} onClick={() => navigate("/signup")} />}

			{/* Sign in button */}
			{!AuthStore.isLoggedIn && (
				<RegularButton
					text={"Sign in"}
					onClick={() => navigate("/signin")}
					bgColor="white"
					color="black"
				/>
			)}

			{/* Write button */}
			{AuthStore.isLoggedIn && (
				<div className="hidden md:flex">
					<WriteBlogButton />
				</div>
			)}

			{/* Notification button */}
			{AuthStore.isLoggedIn && <NotificationButton />}

			{/* Profile Icon */}
			{AuthStore.isLoggedIn && <ProfileIcon onClick={() => setSideBarState(state => !state)}/>}

			{sideBarState && <SideBar />}
		</div>
	);
};

export default Header;
