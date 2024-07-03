import { draftType } from "@aayushlad/medium-clone-common";
import { useState } from "react";
import { formatDate } from "../helper/formatDate";
import MoreOptions from "./buttons/MoreOptionsButton";
import DraftDropDown from "./DraftDropDown";

type props = {
	draft: draftType;
};

const StoryDraftPreview = ({ draft }: props) => {
	const [moreOptionsDropdown, setMoreOptionsDropdown] = useState<boolean>(false);

	return (
		<div className="StoryDraftPreview mt-6 border-b border-slate-5 max-w-[680px] sm:mx-auto lg:mx-0 lg:mr-auto flex flex-col gap-2 cursor-pointer">
			<div className="draft-body flex ">
				<div className="content pr-4  flex flex-col gap-2 sm:pr-10">
					<div className="title font-bold text-xl w-full text-left">{draft.title}</div>

					<div className="description hidden sm:block">{draft.description}</div>
				</div>

				{draft.coverImg && (
					<div className="cover-image min-w-[50px] max-w-[100px] sm:min-w-[150px]">
						<img className="w-full block" src={draft.coverImg as string} alt="cover-image" />
					</div>
				)}
			</div>

			<div className="draft-footer text-gray-800 pb-2 flex justify-between">
				<div>Last edited {formatDate(draft.postedOn as string)}</div>

				<div className="relative">
					<MoreOptions onClick={() => setMoreOptionsDropdown((state) => !state)} />
					{moreOptionsDropdown && <DraftDropDown storyId={draft.id} />}
				</div>
			</div>
		</div>
	);
};

export default StoryDraftPreview;
