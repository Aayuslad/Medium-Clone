import { responseType } from "@aayushlad/medium-clone-common";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import defaultProfile from "../assets/defaultProfile.jpg";
import { formatDate } from "../helper/formatDate";
import { AuthStore } from "../stores/authStore";
import { StoryStore } from "../stores/storyStore";
import ProfileIcon from "./ProfileIcon";
import ResponseDropdown from "./ResponseDropdown";
import CommentsButton from "./buttons/CommentsButton";
import MoreOptions from "./buttons/MoreOptionsButton";
import RegularButton from "./buttons/RegularButton";
import ReplySkeleton from "./skelitons/ReplySkeleton";
import { makeReplyToResponseSchemaType } from "@aayushlad/medium-clone-common";

type props = {
	response: responseType;
	authorName: string;
	setResponses: React.Dispatch<React.SetStateAction<responseType[] | undefined>>;
	setResponseCount: React.Dispatch<React.SetStateAction<number>>;
};

const Response = ({ response, authorName, setResponses, setResponseCount }: props) => {
	const navigate = useNavigate();
	const [replyForm, setReplyForm] = useState<boolean>(false);
	const [replyBox, setReplyBox] = useState<boolean>(false);
	const [replies, setReplies] = useState<responseType[] | undefined>(undefined);
	const [replyCount, setReplyCount] = useState<number>(response.replyCount || 0);
	const [dropdown, setDropdown] = useState<boolean>(false);
	const [editingResponse, setEditingResponse] = useState<boolean>(false);
	const [deletingResponse, setDeletingResponse] = useState<boolean>(false);
	const storyStore = StoryStore();
	const authStore = AuthStore();
	const [page, setPage] = useState<number>(1);

	const formik = useFormik<makeReplyToResponseSchemaType>({
		initialValues: {
			content: "",
			responseId: "",
		},
		onSubmit: async (values) => {
			const replies = await storyStore.makeReplyToResponse(values);
			if (replies) setReplies((state) => [...(state || []), replies]);
			formik.setFieldValue("content", "");
			setReplyForm(false);
			setReplyBox(true);
			setReplyCount((count) => count + 1);
		},
	});

	const editResponseFormik = useFormik({
		initialValues: {
			content: response.content,
			responseId: response.id,
		},
		onSubmit: async (values) => {
			console.log(values);
			const res = await storyStore.editResponse(values);
			if (res) {
				response.content = res.content;
				setEditingResponse(false);
			}
		},
	});

	useEffect(() => {
		formik.setFieldValue("responseId", response.id);
	}, [response.id]);

	// response data fetching
	useEffect(() => {
		(async () => {
			if (replyBox && replies === undefined && replyCount !== 0) {
				const res = await storyStore.getReplyByResponseId({ responseId: response.id }, page);
				if (res) setReplies((state) => [...(state || []), ...res]);
			}
		})();
	}, [replyBox]);
	useEffect(() => {
		(async () => {
			if (replyBox && replyCount !== 0) {
				const res = await storyStore.getReplyByResponseId({ responseId: response.id }, page);
				if (res) setReplies((state) => [...(state || []), ...res]);
			}
		})();
	}, [page]);

	// height auto adjustment for reply textarea
	useEffect(() => {
		const reply = document.getElementById("reply") as HTMLTextAreaElement;
		const editResponse = document.getElementById("editResponse") as HTMLTextAreaElement;

		if (reply) {
			reply.style.height = "auto";
			reply.style.height = `${reply.scrollHeight}px`;
		}
		if (editResponse) {
			console.log("reached here");

			editResponse.style.height = "auto";
			editResponse.style.height = `${editResponse.scrollHeight}px`;
		}
	}, [formik.values.content, editResponseFormik.values.content, editingResponse]);

	return (
		<div className="Response border-b border-slate-200 pb-1 px-2 mb-6 relative">
			{dropdown && (
				<ResponseDropdown
					writerName={response.user.userName}
					setEditingResponse={setEditingResponse}
					setDropdown={setDropdown}
					setDeletingResponse={setDeletingResponse}
				/>
			)}

			{!editingResponse && (
				<div>
					{/* header */}
					<div className="response-header flex gap-4">
						<ProfileIcon
							profileImg={response.user.profileImg || defaultProfile}
							heightWidth={8}
							marginX={false}
							onClick={() => navigate(`/user/${response.user.id}/Home`)}
						/>

						<div>
							<div className="text-xs font-semibold">
								{response.user.userName}
								{"  "}
								{response.user.userName === authStore.user?.userName && (
									<span className="bg-slate-200 mx-1 px-[5px] pb-[1px] rounded text-slate-600 text-[10px]">
										you
									</span>
								)}
								{response.user.userName === authorName && (
									<span className="bg-slate-200 mx-1 px-[5px] pb-[1px] rounded text-slate-600 text-[10px]">
										Author
									</span>
								)}
							</div>
							<div className="text-xs">{formatDate(response.postedAt)}</div>
						</div>

						<div className="block ml-auto">
							<MoreOptions onClick={() => setDropdown((state) => !state)} />
						</div>
					</div>

					{/* body */}
					<pre className="response-body font-sans mt-3 text-wrap">{response.content}</pre>

					{/* fotter */}
					<div className="buttons w-full flex justify-between">
						<div className="-mx-3">
							<CommentsButton
								onClick={() => setReplyBox((state) => !state)}
								responseCount={replyCount || 0}
							/>
						</div>
						<button
							type="button"
							className="ReplyButton block px-2 py-1 text-sm hover:underline"
							onClick={() => setReplyForm((state) => !state)}
						>
							Reply
						</button>
					</div>
				</div>
			)}

			{editingResponse && (
				<div className="editResponsebox">
					<form
						className="editResponseform p-4 my-2 custom-box-shadow rounded"
						onSubmit={editResponseFormik.handleSubmit}
					>
						<textarea
							id="editResponse"
							rows={1}
							className="responseConetnt w-full max-h-[300px] resize-none outline-none"
							placeholder="What are your thoughts?"
							{...editResponseFormik.getFieldProps("content")}
						></textarea>

						<div className="buttons flex justify-end mt-4">
							<RegularButton
								text="Cancel"
								type="reset"
								bgColor="white"
								color="black"
								onClick={() => editResponseFormik.resetForm()}
							/>
							<RegularButton
								text={`${
									storyStore.buttonLoading && editResponseFormik.values.content != ""
										? "Updating..."
										: "Update"
								}`}
								type="submit"
								bgColor="green"
								color="white"
							/>
						</div>
					</form>
				</div>
			)}

			{deletingResponse && (
				<div className="absolute px-10 top-0 left-0 w-[100%] h-[100%] bg-white flex items-center flex-col gap-3	text-center">
					Deleted responses are gone forever. Are you sure?
					<div>
						<RegularButton
							onClick={() => setDeletingResponse(false)}
							color="black"
							bgColor="white"
							text="Cancel"
						/>
						<RegularButton
							onClick={async () => {
								const flag = await storyStore.deleteResponse(response.id);
								if (flag) {
									setResponses((state) => state?.filter((res) => res.id !== response.id));
									setDeletingResponse(false);
									setResponseCount((state) => state - 1);
								}
							}}
							color="white"
							bgColor="red"
							text={`${storyStore.buttonLoading? "Deleting..." : "Delete"}`}
						/>
					</div>
				</div>
			)}

			{/* Replies */}
			<div className="replysection border-l-4 border-slate-200 px-4">
				{replyForm && (
					<form
						className="replyform p-4 my-2 custom-box-shadow rounded"
						onSubmit={formik.handleSubmit}
					>
						<textarea
							id="reply"
							rows={1}
							className="responseConetnt w-full max-h-[300px] resize-none outline-none"
							placeholder={`Replaing to ${response.user.userName}`}
							{...formik.getFieldProps("content")}
						></textarea>

						<div className="buttons flex justify-end mt-4">
							<RegularButton
								text="Cancel"
								type="reset"
								bgColor="white"
								color="black"
								onClick={() => formik.resetForm()}
							/>
							<RegularButton
								text={`${
									storyStore.buttonLoading && formik.values.content != ""
										? "Responding..."
										: "Respond"
								}`}
								type="submit"
								bgColor="green"
								color="white"
							/>
						</div>
					</form>
				)}

				{replyBox && (
					<div className="my-4">
						{replies?.map((reply, index) => {
							return (
								<div className="reply pb-4 pt-2 mb-3 border-b border-slate-200" key={index}>
									<div className="response-header flex gap-4">
										<ProfileIcon
											profileImg={reply.user.profileImg || defaultProfile}
											heightWidth={8}
											marginX={false}
											onClick={() => navigate(`/user/${reply.user.id}/Home`)}
										/>
										<div>
											<div className="text-xs font-semibold">
												{reply.user.userName}{" "}
												{reply.user.userName === authStore.user?.userName && (
													<span className="bg-slate-200 mx-1 px-[5px] pb-[1px] rounded text-slate-600 text-[10px]">
														you
													</span>
												)}
												{reply.user.userName === authorName && (
													<span className="bg-slate-200 mx-1 px-[5px] pb-[1px] rounded text-slate-600 text-[10px]">
														Author
													</span>
												)}
											</div>
											<div className="text-xs">{formatDate(reply.postedAt)}</div>
										</div>
									</div>

									<pre className="response-body font-sans mt-3 text-wrap">
										{reply.content}
									</pre>
								</div>
							);
						})}
						{storyStore.skeletonLoading && <ReplySkeleton />}
						{replyCount - 4 * page > 0 && (
							<button type="button" onClick={() => setPage((state) => state + 1)}>
								Fetch {replyCount - 4 * page} more
							</button>
						)}
						{!storyStore.skeletonLoading && !replies?.length && <div>No Replies Yet</div>}
					</div>
				)}
			</div>
		</div>
	);
};

export default Response;
