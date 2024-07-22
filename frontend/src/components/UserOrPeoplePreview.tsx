import { useNavigate } from "react-router-dom";
import BigFollowFollowingButton from "./buttons/BigFollowFollowingButton";
import ProfileIcon from "./ProfileIcon";
import defaultProfile from "../assets/defaultProfile.jpg";
import { userType } from "@aayushlad/medium-clone-common";

export default function UserOrPeoplePreview({ index, author }: { index: number; author: userType }) {
	const navigate = useNavigate();

	return (
		<div key={index} className="flex pt-8 items-center gap-5">
			<ProfileIcon
				marginX={false}
				profileImg={author.profileImg || defaultProfile}
				onClick={() => navigate(`/user/${author.id}/Home`)}
				heightWidth={10}
			/>

			<div className="flex-1">
				<div className="flex items-center gap-2">
					<h3 className="font-medium text-[17px]">{author.userName || "MediumUser"}</h3>
					{" · "}
					<span className="text-sm text-gray-700">
						{author.followersCount} {"  "}Followers
					</span>
				</div>
				<p className="text-sm text-gray-700  sm:block">{author.bio}</p>
			</div>

			<BigFollowFollowingButton user={author} />
		</div>
	);
}
