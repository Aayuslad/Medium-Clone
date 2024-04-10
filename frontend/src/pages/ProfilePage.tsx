import { userType } from "@aayushlad/medium-clone-common";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import defaultProfile from "../assets/defaultProfile.jpg";
import BlogPreview from "../components/BlogPreview";
import EditProfile from "../components/EditProfile";
import Header from "../components/Header";
import RegularButton from "../components/buttons/RegularButton";
import { AuthStore } from "../stores/authStore";
import { UsersStore } from "../stores/usersStore";
import ProfilePgaeSkeliton from "../components/skelitons/ProfilePageSkeleton";

const ProfilePage = () => {
	const { id } = useParams<{ id: string }>();
	const usersStore = UsersStore();
	const authStore = AuthStore();
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [user, setUser] = useState<userType>();
	const [profileEdit, setProfileEdit] = useState<boolean>(false);
	const [aboutFormState, setAboutFormState] = useState<boolean>(true);
	const [currentNav, setCurrentNav] = useState<"home" | "about">("home");

	const formik = useFormik({
		initialValues: {
			about: "",
		},
		onSubmit: async (values) => {
			await usersStore.updateUserAboutSection(values);
			const about = formik.values.about;
			formik.resetForm();
			setAboutFormState(true);
			formik.setValues({ about });
		},
	});

	// fetching user data
	useEffect(() => {
		(async () => {
			if (id) {
				const user = await usersStore.getAnotherUser({ id });
				formik.setValues({ about: user.about as string });
				setUser(user);
			}
		})();
	}, [id]);

	// changing textaria height according to content
	useEffect(() => {
		const content = document.getElementById("about") as HTMLTextAreaElement;
		if (content) {
			content.style.height = "auto";
			content.style.height = `${content.scrollHeight}px`;
		}
	}, [formik.values.about]);

	// on auto focus, cursor must be at the end of text.
	useEffect(() => {
		if (!aboutFormState && textareaRef.current) {
			textareaRef.current.setSelectionRange(
				textareaRef.current.value.length,
				textareaRef.current.value.length,
			);
		}
	}, [aboutFormState]);

	return (
		<div className="ProfilePage">
			<Header />

			{!usersStore.skelitonLoading && <div className="main-container w-full max-w-6xl mx-auto mt-14 flex">
				<div className="big-container flex-1 px-3 border-r-2 border-neutral-300">
					<h2 className="username text-5xl font-semibold py-12">{user?.name}</h2>

					{/* Navbar */}
					<div className="nav flex gap-6 border-b border-slate-200 px-4 lg:mr-20">
						<div
							onClick={() => setCurrentNav("home")}
							className={`cursor-pointer py-4 border-black ${
								currentNav === "home" ? "border-b" : ""
							} border-black`}
						>
							Home
						</div>
						<div
							onClick={() => setCurrentNav("about")}
							className={`cursor-pointer py-4 border-black ${
								currentNav === "about" ? "border-b" : ""
							} border-black`}
						>
							About
						</div>
					</div>

					{/* User Blogs */}
					{currentNav === "home" && (
						<div className="blogs lg:mr-24">
							{user?.posts?.map((blog, index) => (
								<BlogPreview blog={blog} index={index} key={index} />
							))}
						</div>
					)}

					{/* About section */}
					{currentNav === "about" && user?.id === authStore.user?.id && (
						<form
							className="about py-6 text-lg text-justify lg:mr-24 border-b border-slate-200"
							onSubmit={formik.handleSubmit}
						>
							<textarea
								id="about"
								rows={1}
								ref={textareaRef}
								readOnly={aboutFormState}
								{...formik.getFieldProps("about")}
								className="resize-none w-full max-w-screen-lg outline-none mb-6 sm:mx-4"
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
											onClick={() => formik.handleSubmit()}
										/>

										<RegularButton
											type="reset"
											text="Cancel"
											bgColor="white"
											color="black"
											borderColor="black"
											onClick={() => {
												formik.resetForm();
												setAboutFormState(true);
											}}
										/>
									</>
								)}
							</div>
						</form>
					)}

					{currentNav === "about" && user?.id !== authStore.user?.id && user?.about && (
						<div className="about py-6 text-lg text-justify lg:mr-24 border-b border-slate-200">
							{user?.about}
						</div>
					)}
				</div>

				<div className="small-container w-96 hidden lg:block px-10 h-screen sticky top-0">
					<div className="flex items-center justify-between">
						<div className="profile-img w-20 pt-10 pb-3">
							<img
								src={(user?.profileImg as string) || defaultProfile}
								alt=""
								className="rounded-full w-full"
							/>
						</div>

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

					<div className="user-name text-lg font-semibold">{user?.name}</div>

					<div className="followers">
						<span>243</span> Followers
					</div>

					<div className="bio py-3">{user?.bio}</div>

					{!(user?.id === authStore.user?.id) && (
						<div className="follow -mx-1 sm:-mx-2 py-1">
							<RegularButton
								text="Follow"
								color="white"
								bgColor="green"
								onClick={() => console.log("Follow")}
							/>
						</div>
					)}

					{!(user?.id === authStore.user?.id) && (
						<div className="following border border-black mt-6 py-2">Following</div>
					)}
				</div>
			</div>}

			{usersStore.skelitonLoading && <ProfilePgaeSkeliton />}

			{/* Edit user profile compoent */}
			{profileEdit && <EditProfile onCloseClick={() => setProfileEdit(false)} />}
		</div>
	);
};

export default ProfilePage;
