import { storyType, userType } from "@aayushlad/medium-clone-common";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import defaultProfile from "../assets/defaultProfile.jpg";
import EditProfile from "../components/EditProfile";
import Header from "../components/Header";
import StoryPreview from "../components/StoryPreview";
import BigFollowFollowingButton from "../components/buttons/BigFollowFollowingButton";
import RegularButton from "../components/buttons/RegularButton";
import RegularLeftContainerNavbar from "../components/navbars/RegularLeftContainerNavbar";
import ProfilePgaeSkeliton from "../components/skelitons/ProfilePageSkeleton";
import BlogsSkelitons from "../components/skelitons/StorySkeletons";
import LeftContainer from "../components/wrapperComponents/LeftContainer";
import MainConntainer from "../components/wrapperComponents/MainContainer";
import RightContainer from "../components/wrapperComponents/RightContainer";
import { AuthStore } from "../stores/authStore";
import { UsersStore } from "../stores/usersStore";

const ProfilePage = () => {
	const { id } = useParams<{ id: string }>();
	const usersStore = UsersStore();
	const authStore = AuthStore();
	const navigate = useNavigate();
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [user, setUser] = useState<userType>();
	const [stories, setStories] = useState<storyType[]>();
	const [allStoriesLoaded, setAllStoriesLoaded] = useState<boolean>(false);
	const [profileEdit, setProfileEdit] = useState<boolean>(false);
	const [aboutFormState, setAboutFormState] = useState<boolean>(true);
	const [currentNav, setCurrentNav] = useState<string>("");
	const { nav } = useParams<{ nav: string }>();
	const mainContainerRef = useRef<HTMLDivElement | null>(null);
	const [page, setPage] = useState<number>(1);

	const formik = useFormik({
		initialValues: {
			about: authStore.user?.about as string,
		},
		onSubmit: async (values) => {
			await usersStore.updateUserAboutSection(values);
			const about = formik.values.about;
			formik.resetForm();
			setAboutFormState(true);
			formik.setValues({ about });
		},
	});

	useEffect(() => {
		setCurrentNav(nav || "Home");
	}, [nav]);

	// fetching user information
	useEffect(() => {
		(async () => {
			if (id) {
				const user = await usersStore.getAnotherUser({ id });
				formik.setValues({ about: user.about as string });
				setUser(user);
				setStories([]);
				setAllStoriesLoaded(false);
				setPage(1);
			}
		})();
	}, [id]);

	// fetching user stories
	useEffect(() => {
		(async () => {
			if (user && id && !allStoriesLoaded) {
				const stories = await usersStore.getUserStories({ id, page, setAllStoriesLoaded });
				stories && setStories((state) => [...(state || []), ...stories]);
			}
		})();
	}, [page, user]);

	// changing textaria height according to content
	useEffect(() => {
		const content = document.getElementById("about") as HTMLTextAreaElement;
		if (content) {
			content.style.height = "auto";
			content.style.height = `${content.scrollHeight}px`;
		}
	}, [currentNav, document.getElementById("about")]);

	// on auto focus, cursor must be at the end of text.
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.setSelectionRange(
				textareaRef.current.value.length,
				textareaRef.current.value.length,
			);
		}
	}, [aboutFormState]);

	// pagination logic
	const handleScroll = () => {
		if (mainContainerRef.current) {
			const mainContainer = mainContainerRef.current;
			const containerBottom = mainContainer.offsetTop + mainContainer.offsetHeight;
			const scrollPosition = window.pageYOffset + window.innerHeight;

			if (scrollPosition >= containerBottom - 1) {
				setPage((state) => state + 1);
			}
		}
	};

	// scroll event
	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [currentNav]);

	return (
		<div className="ProfilePage">
			<Header />

			{(user || !usersStore.skeletonLoading) && (
				<MainConntainer ref={mainContainerRef}>
					<LeftContainer>
						{/* Profile */}
						<div className="profile lg:hidden flex items-center gap-6 pt-8 pb-4 px-1">
							<div className="profile-img w-14">
								<img
									src={(user?.profileImg as string) || defaultProfile}
									alt=""
									className="rounded-full w-full"
								/>
							</div>

							<div>
								<div className="username text-xl font-semibold">{user?.userName}</div>
								<div className="followers">
									<span>{user?.followersCount}</span>
									{user?.followersCount === 1 ? " follower" : " followers"}
								</div>
							</div>

							<div className="flex-1"></div>

							{user?.id === authStore.user?.id && (
								<button
									type="button"
									className="text-sm font-semibold text-green-600 p-2"
									onClick={() => setProfileEdit(true)}
								>
									Edit Profile
								</button>
							)}
						</div>

						{/* Follow Unfollow button */}
						{!(user?.id === authStore.user?.id) && (
							<div className="lg:hidden px-4">
								<BigFollowFollowingButton user={user as userType} setUser={setUser} />
							</div>
						)}

						{/* Username */}
						<h2 className="username hidden lg:block text-5xl font-semibold py-12">
							{user?.userName}
						</h2>

						{/* Navbar */}
						<RegularLeftContainerNavbar
							page={`user/${id}`}
							navs={["Home", "About"]}
							currentNav={currentNav}
							setCurrentNav={setCurrentNav}
						/>

						{/* User stories */}
						{currentNav === "Home" && (
							<div className="stories">
								{stories?.map((story, index) => (
									<StoryPreview story={story} key={index} version="profile" />
								))}

								{usersStore.skeletonLoading && <BlogsSkelitons />}
							</div>
						)}

						{/* About section */}
						{currentNav === "About" && user?.id === authStore.user?.id && (
							<form
								className="about py-6 text-lg text-justify lg:mr-24 border-b border-slate-200"
								onSubmit={formik.handleSubmit}
							>
								<textarea
									id="about"
									rows={1}
									placeholder="Write about yourself here..."
									ref={textareaRef}
									readOnly={aboutFormState}
									{...formik.getFieldProps("about")}
									className="resize-none w-full outline-none mb-6 sm:px-4"
								/>

								<div className="w-full flex justify-end">
									{aboutFormState ? (
										<RegularButton
											type="button"
											text="Edit"
											bgColor="white"
											color="black"
											borderColor="black"
											onClick={() => {
												setAboutFormState(false);
												textareaRef.current && textareaRef.current.focus();
											}}
										/>
									) : (
										<>
											<RegularButton
												type="button"
												text="Save"
												bgColor="black"
												color="white"
												borderColor="black"
												disabled={usersStore.buttonLoading}
												onClick={() => formik.handleSubmit()}
											/>

											<RegularButton
												type="reset"
												text="Cancel"
												bgColor="white"
												color="black"
												borderColor="black"
												disabled={usersStore.buttonLoading}
												onClick={() => {
													formik.resetForm();
													setAboutFormState(true);
													formik.setValues({
														about: authStore.user?.about as string,
													});
												}}
											/>
										</>
									)}
								</div>
							</form>
						)}

						{currentNav === "About" && user?.id !== authStore.user?.id && user?.about && (
							<div className="border-b-2 border-slate-200 lg:mr-24">
								<pre className="about h-full w-full lg:max-w-[670px] text-wrap py-6 sm:mx-4 sm:pr-6  font-sans text-lg text-justify lg:mr-24">
									{user?.about}
								</pre>
							</div>
						)}
					</LeftContainer>

					<RightContainer>
						{/* Profile */}
						<div className="Profile flex items-center justify-between mt-16 mb-4">
							<div className="profile-img h-[80px] w-[80px] rounded-full aspect-square flex items-center justify-center overflow-hidden">
								<img
									src={(user?.profileImg as string) || defaultProfile}
									alt=""
									className="rounded-full w-full"
								/>
							</div>

							{user?.id === authStore.user?.id && (
								<button
									type="button"
									className="text-sm font-semibold text-green-600 "
									onClick={() => setProfileEdit(true)}
								>
									Edit Profile
								</button>
							)}
						</div>

						{/* Username */}
						<div className="user-name text-lg font-semibold">{user?.userName}</div>

						{/* Followers */}
						<div className="followers">
							<span>{user?.followersCount}</span>
							{user?.followersCount === 1 ? " follower" : " followers"}
						</div>

						{/* Bio */}
						<div className="bio py-3">{user?.bio}</div>

						{/* Follow Unfollow button */}
						{!(user?.id === authStore.user?.id) && (
							<BigFollowFollowingButton user={user as userType} setUser={setUser} />
						)}

						{/* Top 5 following */}
						{!(user?.id === authStore.user?.id) && (
							<div className="following mt-6 py-2">
								<h3 className="font-semibold">Following</h3>
								<div className="flex flex-col gap-2 mt-3">
									{user?.topFiveFollowing?.map((profile) => {
										return (
											<div
												className="profile flex items-center gap-3 cursor-pointer"
												onClick={() => navigate(`/user/${profile.id}/Home`)}
											>
												<div className="img h-7 w-7">
													<img
														src={profile.profileImg || defaultProfile}
														alt="profile image"
														className="w-full aspect-square rounded-[50%]"
													/>
												</div>
												<div className="userName hover:underline">
													{profile.userName}
												</div>
											</div>
										);
									})}
								</div>
							</div>
						)}
					</RightContainer>
				</MainConntainer>
			)}

			{!user && usersStore.skeletonLoading && <ProfilePgaeSkeliton />}

			{/* Edit user profile compoent */}
			{profileEdit && <EditProfile onCloseClick={() => setProfileEdit(false)} />}
		</div>
	);
};

export default ProfilePage;
