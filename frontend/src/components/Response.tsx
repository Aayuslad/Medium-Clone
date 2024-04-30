import { responseType } from "@aayushlad/medium-clone-common";
import ProfileIcon from "./ProfileIcon";
import { formatDate } from "../helper/formatDate";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import RegularButton from "./buttons/RegularButton";
import { StoryStore } from "../stores/storyStore";

const Response = ({ response }: { response: responseType }) => {
	const navigate = useNavigate();
	const [replyBox, setReplyBox] = useState<boolean>(false);
	const storyStore = StoryStore();

	const formik = useFormik({
		initialValues: {
			content: "",
			responseId: "",
		},
		onSubmit: async (values) => {
			console.log(values);
			formik.resetForm();
			setReplyBox(false);
		}
	})

	useEffect(() => {
		const reply = document.getElementById("reply") as HTMLTextAreaElement;

		if (reply) {
			reply.style.height = "auto";
			reply.style.height = `${reply.scrollHeight}px`;
		}
	}, [formik.values.content]);
	
	return (
		<div className="Response border-b border-slate-200 pb-3 px-2 mb-6">
			<div className="response-header flex gap-4">
				<ProfileIcon
					profileImg={response.user.profileImg}
					heightWidth={8}
					marginX={false}
					onClick={() => navigate(`/user/${response.user.id}/Home`)}
				/>
				<div>
					<div className="text-xs font-semibold">{response.user.userName}</div>
					<div className="text-xs">{formatDate(response.postedAt)}</div>
				</div>
			</div>

			<pre className="response-body font-sans mt-3 text-wrap">{response.content}</pre>

			<button
				type="button"
				className="ReplyButton block ml-auto px-2 py-1 text-sm hover:underline"
				onClick={() => setReplyBox((state) => !state)}
			>
				Reply
			</button>

			{replyBox && (
				<div className="ReplyBox border-l-4 border-slate-200 px-4 py-2">
					<form className="p-4 custom-box-shadow rounded">
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
				</div>
			)}
		</div>
	);
};

export default Response;
