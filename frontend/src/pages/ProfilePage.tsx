import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BlogPreview from "../components/BlogPreview";
import Header from "../components/Header";
import RegularButton from "../components/buttons/RegularButton";
import authStore from "../stores/authStore";
import { userType } from "@aayushlad/medium-clone-common";
import EditProfile from "../components/EditProfile";
import defaultProfile from "../assets/defaultProfile.jpg";

const ProfilePage = () => {
	const AuthStore = authStore();
	const [profileEdit, setProfileEdit] = useState<boolean>(false);
	const { id } = useParams<{ id: string }>();
	const [user, setUser] = useState<userType>();

	useEffect(() => {
		async function getUserData() {
			if (id) {
				const user = await AuthStore.getAnotherUser({ id });
				console.log(user);
				setUser(user);
			}
		}

		getUserData();
	}, [id]);

	return (
		<div className="ProfilePage ">
			<Header />

			<div className="main-container w-full flex-1 max-w-6xl mx-auto mt-14 flex">
				<div className="big-container flex-1 px-3 border-r-2 border-neutral-300">
					<h2 className="username text-5xl font-semibold py-12">{user?.name}</h2>

					<div className="nav flex gap-6 border-b border-slate-200 py-4 px-4 lg:mr-20">
						<div>Home</div>
						<div>About</div>
					</div>

					<div className="blogs lg:mr-24">
						{user?.posts?.map((blog, index) => {
							return <BlogPreview blog={blog} index={index} key={index} />;
						})}
					</div>

					<div className="about py-6 text-lg text-justify">{user?.about}</div>
				</div>

				<div className="small-container w-96 hidden lg:block px-10 h-fit sticky top-0">
					<div className="flex items-center justify-between">
						<div className="profile-img w-20 pt-10 pb-3">
							<img
								src={(AuthStore.user?.profileImg as string) || defaultProfile}
								alt=""
								className="rounded-full w-full"
							/>
						</div>

						{user?.id === AuthStore.user?.id && (
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

					{!(user?.id === AuthStore.user?.id) && (
						<div className="follow -mx-1 sm:-mx-2 py-1">
							<RegularButton
								text="Follow"
								color="white"
								bgColor="green"
								onClick={() => console.log("Follow")}
							/>
						</div>
					)}

					{!(user?.id === AuthStore.user?.id) && (
						<div className="following border border-black mt-6 py-2">Following</div>
					)}
				</div>
			</div>

			{profileEdit && <EditProfile onCloseClick={() => setProfileEdit(false)} />}
		</div>
	);
};

export default ProfilePage;
