import SearchBox from "./SearchBox";
import MobileSearchButton from "./MobileSearchButton";
import RegularButton from "./RegularButton";
import WriteBlogButton from "./WriteBlogButton";
import authStore from "../stores/authStore";
import { blogStore } from "../stores/blogStore";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import useScrollDirection from "../hooks/useScrollDirection";
import NotificationButton from "./NotificationButton";
import ProfileIcon from "./ProfileIcon";

const Header = () => {
	const AuthStore = authStore();
	const BlogStore = blogStore();
	const navigate = useNavigate();
	const scrollDirection = useScrollDirection();

	async function handleWrite() {
		const formData = new FormData();
		formData.append("title", "");
		formData.append("content", "");
		formData.append("description", "");
		formData.append("published", "false");
		formData.append("topics", "");
		formData.append("coverImage", "");
		const id = await BlogStore.postBlog(formData);
		console.log(id);
		if (id) {
			navigate(`/compose/${id}`);
		}
	}

	return (
		<div
			className={`Header w-full h-14 px-5 fixed ${
				scrollDirection === "down" ? "-top-24" : "top-0"
			} flex items-center gap-1 border-b-2 border-neutral-300 bg-white backdrop-blur-20 duration-500`}
		>
			{/* Medium logo */}
			<div className="logo cursor-pointer">
				<img src={logo} className="App-logo w-10 h-10" alt="logo" />
			</div>

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
			{AuthStore.isLoggedIn && <WriteBlogButton handleWrite={handleWrite} />}

			{/* Notification button */}
			{AuthStore.isLoggedIn && <NotificationButton />}

			{/* Profile Icon */}
			{AuthStore.isLoggedIn && <ProfileIcon />}
		</div>
	);
};

export default Header;
