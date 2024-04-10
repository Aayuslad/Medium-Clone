import { useFormik } from "formik";
import { useEffect, useState } from "react";
import defaultProfile from "../assets/defaultProfile.jpg";
import { AuthStore } from "../stores/authStore";
import { UsersStore } from "../stores/usersStore";
import CrossCloseButton from "./buttons/CrossCloseButton";
import RegularButton from "./buttons/RegularButton";

type editProfileType = {
	profileImg: string | File;
	name: string;
	bio: string;
};

const EditProfile = ({ onCloseClick }: { onCloseClick: () => void }) => {
	const [profileImgLocal, setProfileImgLocal] = useState<string>("");
	const authStore = AuthStore();
	const usersStore = UsersStore();

	const formik = useFormik<editProfileType>({
		initialValues: {
			profileImg: "",
			name: "",
			bio: "",
		},
		validateOnBlur: false,
		validateOnChange: false,
		onSubmit: async (values) => {
			console.log(values);
			const formData = new FormData();
			formData.append("name", values.name);
			formData.append("bio", values.bio);
			formData.append("profileImg", values.profileImg);
			await usersStore.updateUser(formData);
			onCloseClick();
		},
	});

	useEffect(() => {
		if (authStore.user) {
			formik.setValues({
				profileImg: authStore.user.profileImg || "",
				name: authStore.user.name,
				bio: authStore.user.bio || "",
			});
		}
	}, [authStore.user]);

	// image upload logic
	const onImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		formik.setValues({ ...formik.values, profileImg: e.target.files ? e.target.files[0] : "" });
		setProfileImgLocal(e.target.files ? URL.createObjectURL(e.target.files[0]) : "");
	};

	return (
		<div className="z-20 edit-profile w-screen h-screen bg-[#000000aa] backdrop-blur-[2px] absolute top-0 right-0 flex items-center justify-center">
			<form
				className="bg-white p-8 rounded-md w-[540px] max-w-screen text-sm text-gray-500 flex flex-col gap-4 custom-box-shadow h-screen sm:h-fit relative"
				onSubmit={formik.handleSubmit}
			>
				<div className="absolute top-5 right-5">
					<CrossCloseButton type={"button"} onClick={onCloseClick} />
				</div>

				<h2 className="text-2xl font-semibold block mx-auto text-center text-black">
					Profie Information
				</h2>

				<div className="photo flex flex-col gap-2">
					<div className="text-black font-semibold">Photo</div>
					<div className="flex text-sm">
						<div className="w-20 h-20 aspect-square border rounded-[50%]">
							<label htmlFor="profileImg" className="cursor-pointer">
								<img
									src={
										formik.values.profileImg === "" && profileImgLocal === ""
											? defaultProfile
											: profileImgLocal === ""
											? (formik.values.profileImg as string)
											: profileImgLocal
									}
									alt="profile picture"
									className="w-full rounded-[50%]"
								/>
							</label>
							<input
								type="file"
								name="profileImg"
								id="profileImg"
								className="hidden"
								onChange={onImgUpload}
							/>
						</div>
						<div className="pl-6 font-semibold">
							<div className="buttons">
								<label htmlFor="profileImg" className="text-green-500 cursor-pointer">
									Update
								</label>
								<RegularButton
									text={"Remove"}
									onClick={() => console.log("Remove")}
									color={"red"}
									bgColor={"white"}
								/>
							</div>
							<div className="text font-semibold">
								Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels per side.
							</div>
						</div>
					</div>
				</div>

				<div className="name mb-5">
					<label htmlFor="name" className="text-black font-semibold">
						Name*
					</label>
					<input
						type="text"
						id="name"
						{...formik.getFieldProps("name")}
						className="outline-none w-full border-b border-gray-500 mt-4 text-xl text-black"
					/>
					<div>Appears on your Profile page, as your byline, and in your responses.</div>
				</div>

				<div className="bio mb-5">
					<label htmlFor="bio" className="text-black font-semibold">
						Bio
					</label>
					<input
						type="text"
						id="bio"
						{...formik.getFieldProps("bio")}
						maxLength={160}
						className="outline-none w-full border-b border-gray-500 mt-4 text-xl text-black"
					/>
					<div>Appears on your Profile page, as your byline, and in your responses.</div>
				</div>

				<div className="buttons flex justify-end">
					<RegularButton
						text={"Cancel"}
						type={"reset"}
						onClick={onCloseClick}
						color={"green"}
						bgColor={"white"}
						borderColor="green"
					/>
					<RegularButton text={"Save"} type={"submit"} onClick={() => console.log("")} />
				</div>
			</form>
		</div>
	);
};

export default EditProfile;
