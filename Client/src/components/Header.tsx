import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import useScrollDirection from "../hooks/useScrollDirection";
import { AuthStore } from "../stores/authStore";
import ProfileIcon from "./ProfileIcon";
import SearchBox from "./SearchBox";
import SideBar from "./navbars/SideBar";
import MobileSearchButton from "./buttons/MobileSearchButton";
import NotificationButton from "./buttons/NotificationButton";
import RegularButton from "./buttons/RegularButton";
import WriteStoryButton from "./buttons/WriteStoryButton";

const Header = () => {
	const [sideBarState, setSideBarState] = useState<boolean>(false);
	const authStore = AuthStore();
	const navigate = useNavigate();
	const scrollDirection = useScrollDirection();
	const sidebarRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		setSideBarState(false);
	}, [scrollDirection]);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (sidebarRef?.current && !sidebarRef.current.contains(event.target as Node)) {
				setSideBarState(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [sidebarRef]);

	return (
		<div
			className={`Header z-10 w-full max-w-[100vw] h-14 px-5 fixed flex items-center gap-1 border-b border-slate-200 bg-white backdrop-blur-20 duration-200 ${
				scrollDirection === "down" ? "-top-24" : "top-0"
			}`}
		>
			{/* Medium logo */}
			<button className="logo cursor-pointer" onClick={() => navigate("/")}>
				<img src={logo} className="App-logo w-10 h-10" alt="logo" />
			</button>

			{/* Search Box */}
			<div className="hidden md:flex">
				<SearchBox />
			</div>

			<div className="flex-1"></div>

			{/* Serch botton for mobile */}
			<MobileSearchButton />

			{/* Sign up button */}
			{!authStore.isLoggedIn && <RegularButton text={"Sign up"} onClick={() => navigate("/signup")} />}

			{/* Sign in button */}
			{!authStore.isLoggedIn && (
				<RegularButton
					text={"Sign in"}
					onClick={() => navigate("/signin")}
					bgColor="white"
					color="black"
				/>
			)}

			{/* Write button */}
			{authStore.isLoggedIn && (
				<div className="hidden md:flex">
					<WriteStoryButton />
				</div>
			)}

			{/* Notification button */}
			{authStore.isLoggedIn && <NotificationButton />}

			{authStore.isLoggedIn && (
				<div ref={sidebarRef}>
					{/* Profile Icon */}
					<ProfileIcon onClick={() => setSideBarState((state) => !state)} />
					{/* side bar component*/}
					{sideBarState && <SideBar />}
				</div>
			)}
		</div>
	);
};

export default Header;
