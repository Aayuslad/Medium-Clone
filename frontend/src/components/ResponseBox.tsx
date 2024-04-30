import { useEffect, useState } from "react";
import ProfileIcon from "./ProfileIcon";
import CrossCloseButton from "./buttons/CrossCloseButton";
import RegularButton from "./buttons/RegularButton";
import { useFormik } from "formik";
import { StoryStore } from "../stores/storyStore";
import { AuthStore } from "../stores/authStore";
import { responseType } from "@aayushlad/medium-clone-common";
import Response from "./Response";

export type makeResponseSchemaType = {
	content: string;
	storyId: string;
};

type props = {
	storyId: string;
	responseBox: boolean;
	responseCount: number;
	setResponseBox: React.Dispatch<React.SetStateAction<boolean>>;
};

const ResponseBox = ({ responseBox, setResponseBox, storyId, responseCount = 0 }: props) => {
	const storyStore = StoryStore();
	const authStore = AuthStore();
	const [responses, setResponses] = useState<responseType[]>();

	const formik = useFormik<makeResponseSchemaType>({
		initialValues: {
			content: "",
			storyId: "",
		},
		onSubmit: async (values) => {
			console.log(values);
			const response = await storyStore.makeResponse(values);
			formik.resetForm();
			if (response) setResponses([response, ...(responses || [])]);
		},
	});

	useEffect(() => {
		formik.setFieldValue("storyId", storyId);
	}, [storyId]);

	useEffect(() => {
		(async () => {
			if (responseBox) {
				const responses = await storyStore.getResponseByStoryId({ storyId });
				setResponses(responses);
			}
		})();
	}, [storyId, responseBox]);

	useEffect(() => {
		const responseConetnt = document.getElementById("responseConetnt") as HTMLTextAreaElement;

		if (responseConetnt) {
			responseConetnt.style.height = "auto";
			responseConetnt.style.height = `${responseConetnt.scrollHeight}px`;
		}
	}, [formik.values.content]);

	return (
		<div
			className={`ResponseBox h-screen w-screen sm:w-[400px] fixed top-0 ${
				responseBox ? "right-0" : "right-[-100vw] sm:right-[-430px]"
			} z-10 duration-300  bg-white px-4 py-5 custom-box-shadow-2 overflow-y-auto`}
		>
			<div className="header flex justify-between items-center">
				<h3 className="font-semibold text-xl">Responses ({responseCount})</h3>
				<CrossCloseButton onClick={() => setResponseBox(false)} type="button" />
			</div>

			<form
				className="makeResponse h-fit mt-6 px-3 py-4 rounded custom-box-shadow"
				onSubmit={formik.handleSubmit}
			>
				<div className="profile flex">
					<div className="-ml-4">
						<ProfileIcon heightWidth={7} />
					</div>
					<span>{authStore.user?.userName}</span>
				</div>

				<textarea
					id="responseConetnt"
					rows={1}
					className="responseConetnt w-full max-h-[300px] mt-4 resize-none outline-none"
					placeholder="What are your thoughts ?"
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

			<hr className="my-6 -mx-4 h-px bg-slate-300" />

			{responses?.map((response) => {
				return <Response response={response} key={response.id} />;
			})}
		</div>
	);
};

export default ResponseBox;
