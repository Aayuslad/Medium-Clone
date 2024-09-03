import { useEffect, useRef, useState } from "react";
import ProfileIcon from "./ProfileIcon";
import CrossCloseButton from "./buttons/CrossCloseButton";
import RegularButton from "./buttons/RegularButton";
import { useFormik } from "formik";
import { StoryStore } from "../stores/storyStore";
import { AuthStore } from "../stores/authStore";
import { responseType } from "@aayushlad/medium-clone-common";
import Response from "./Response";
import ResponseSkeleton from "./skelitons/ResponseSkeleton";

export type makeResponseSchemaType = {
	content: string;
	storyId: string;
};

type props = {
	storyId: string;
	authorName: string;
	responseBox: boolean;
	responseCount: number;
	setResponseCount: React.Dispatch<React.SetStateAction<number>>;
	setResponseBox: React.Dispatch<React.SetStateAction<boolean>>;
};

const ResponseBox = ({
	storyId,
	authorName,
	responseBox,
	setResponseBox,
	responseCount = 0,
	setResponseCount,
}: props) => {
	const storyStore = StoryStore();
	const authStore = AuthStore();
	const [responses, setResponses] = useState<responseType[]>();
	const [page, setPage] = useState<number>(1);
	const scrollContainerRef = useRef<HTMLDivElement | null>(null);
	const [allResponseLoaded, setAllResponseLoaded] = useState<boolean>(false);

	const formik = useFormik<makeResponseSchemaType>({
		initialValues: {
			content: "",
			storyId: "",
		},
		onSubmit: async (values) => {
			const response = await storyStore.makeResponse(values);
			formik.resetForm();
			if (response) {
				setResponses([response, ...(responses || [])]);
				setResponseCount((count) => count + 1);
			}
		},
	});

	useEffect(() => {
		formik.setFieldValue("storyId", storyId);
	}, [storyId]);

	// response data fetching
	useEffect(() => {
		(async () => {
			if (responseBox && !allResponseLoaded) {
				const responses = await storyStore.getResponseByStoryId({ storyId }, page);
				responses && setResponses((state) => [...(state ?? []), ...responses]);
				if (responses?.length === 0) {
					setAllResponseLoaded(true);
				}
			}
		})();
	}, [storyId, page]);
	useEffect(() => {
		(async () => {
			if (responseBox && !responses) {
				const responses = await storyStore.getResponseByStoryId({ storyId }, page);
				responses && setResponses((state) => [...(state ?? []), ...responses]);
				if (responses?.length === 0) {
					setAllResponseLoaded(true);
				}
			}
		})();
	}, [storyId, responseBox]);

	// Pagination logic
	const handleScroll = () => {
		const scrollContainer = scrollContainerRef.current;
		if (scrollContainer) {
			const scrollHeight = scrollContainer.scrollHeight;
			const scrollTop = scrollContainer.scrollTop;
			const clientHeight = scrollContainer.clientHeight;

			if (scrollTop + clientHeight >= scrollHeight) {
				setPage((prevPage) => prevPage + 1);
			}
		}
	};

	// scroll event
	useEffect(() => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.addEventListener("scroll", handleScroll);
		}
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	// repond form height auto adjustment
	useEffect(() => {
		const responseConetnt = document.getElementById("responseConetnt") as HTMLTextAreaElement;

		if (responseConetnt) {
			responseConetnt.style.height = "auto";
			responseConetnt.style.height = `${responseConetnt.scrollHeight}px`;
		}
	}, [formik.values.content]);

	return (
		<div
			ref={scrollContainerRef}
			className={`ResponseBox h-screen w-screen sm:w-[400px] fixed top-0 ${
				responseBox ? "right-0" : "right-[-100vw] sm:right-[-430px]"
			} z-10 duration-300  bg-white px-4 py-5 custom-box-shadow-2 overflow-y-auto`}
		>
			<div className="header flex justify-between items-center">
				<h3 className="font-semibold text-xl">Responses ({responseCount})</h3>
				<CrossCloseButton onClick={() => setResponseBox(false)} type="button" />
			</div>

			{authStore.isLoggedIn ? (
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
			) : (
				<div className="px-4 py-2 mt-4 text-slate-700 custom-box-shadow rounded">
					Signin to respond
				</div>
			)}

			<hr className="my-6 -mx-4 h-px bg-slate-300" />

			{(responses || storyStore.skeletonLoading) &&
				responses?.map((response) => {
					return (
						<Response
							response={response}
							key={response.id}
							authorName={authorName}
							setResponses={setResponses}
							setResponseCount={setResponseCount}
						/>
					);
				})}

			{storyStore.skeletonLoading && <ResponseSkeleton />}
		</div>
	);
};

export default ResponseBox;
