import { responseType } from "@aayushlad/medium-clone-common";
import ProfileIcon from "./ProfileIcon";
import { formatDate } from "../helper/formatDate";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import RegularButton from "./buttons/RegularButton";
import { StoryStore } from "../stores/storyStore";
import defaultProfile from "../assets/defaultProfile.jpg";
import CommentsButton from "./buttons/CommentsButton";
import ReplySkeleton from "./skelitons/ReplySkeleton";
import { AuthStore } from "../stores/authStore";

const Response = ({ response }: { response: responseType }) => {
	const navigate = useNavigate();
	const [replyForm, setReplyForm] = useState<boolean>(false);
	const [replyBox, setReplyBox] = useState<boolean>(false);
	const [replies, setReplies] = useState<responseType[] | undefined>(undefined);
	const [replyCount, setReplyCount] = useState<number>(response.replyCount || 0);
	const storyStore = StoryStore();
	const authStore = AuthStore();

	const formik = useFormik({
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

	useEffect(() => {
		formik.setFieldValue("responseId", response.id);
	}, [response.id]);

	useEffect(() => {
		(async () => {
			if (replyBox && replies === undefined && replyCount !== 0) {
				const res = await storyStore.getReplyByResponseId({ responseId: response.id });
				if (res) setReplies((state) => [...(state || []), ...res]);
			}
		})();
	}, [replyBox]);

	useEffect(() => {
		const reply = document.getElementById("reply") as HTMLTextAreaElement;

		if (reply) {
			reply.style.height = "auto";
			reply.style.height = `${reply.scrollHeight}px`;
		}
	}, [formik.values.content]);

	return (
		<div className="Response border-b border-slate-200 pb-1 px-2 mb-6">
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
							<span className="bg-slate-200 px-1.5 pb-0.5 rounded text-slate-600 text-xs">
								you
							</span>
						)}
					</div>
					<div className="text-xs">{formatDate(response.postedAt)}</div>
				</div>
			</div>

			<pre className="response-body font-sans mt-3 text-wrap">{response.content}</pre>

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
								text={`${storyStore.buttonLoading ? "Responding..." : "Respond"}`}
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
													<span className="bg-slate-200 px-1.5 pb-0.5 rounded text-slate-600 text-xs">
														you
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
						{!replies && storyStore.skeletonLoading && <ReplySkeleton />}
						{!storyStore.skeletonLoading && !replies?.length && <div>No Replies Yet</div>}
					</div>
				)}

				{}
			</div>
		</div>
	);
};

export default Response;
