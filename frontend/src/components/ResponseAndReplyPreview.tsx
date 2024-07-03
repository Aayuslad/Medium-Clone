import { replyType, responseType } from "@aayushlad/medium-clone-common";
import { formatDate } from "../helper/formatDate";
import { useState } from "react";
import MoreOptions from "./buttons/MoreOptionsButton";
import ResponseAndReplyPreviewDropdown from "./ResponseAndReplyPreviewDropdown";
import { useNavigate } from "react-router-dom";

const ResponseAndReplyPreview = ({ response, reply }: { response?: responseType; reply?: replyType }) => {
	const [moreOptionsDropdown, setMoreOptionsDropdown] = useState<boolean>(false);
	const navigate = useNavigate();

	return (
		<div
			className="ResponseAndReplyPreview flex flex-col gap-2 pt-8 pb-4 border-b border-gray-200"
			onClick={() => {
				navigate(`/story/${response?.storyId || reply?.storyId}`);
			}}
		>
			<div className="body font-semibold">
				{response ? response.content : reply ? reply.content : ""}
			</div>
			<div className="footer text-gray-800 flex justify-between">
				<div>Published on {formatDate(response ? response.postedAt : reply?.postedAt || "")}</div>

				<div className="relative">
					<MoreOptions onClick={() => setMoreOptionsDropdown((state) => !state)} />
					{moreOptionsDropdown && <ResponseAndReplyPreviewDropdown />}
				</div>
			</div>
		</div>
	);
};

export default ResponseAndReplyPreview;
