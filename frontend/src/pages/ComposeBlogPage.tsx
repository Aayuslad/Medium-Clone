import { updateStorySchemaType } from "@aayushlad/medium-clone-common";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import defaultProfile from "../assets/defaultProfile.jpg";
import logo from "../assets/logo.svg";
import CrossCloseButton from "../components/buttons/CrossCloseButton";
import MoreOptions from "../components/buttons/MoreOptionsButton";
import NotificationButton from "../components/buttons/NotificationButton";
import RegularButton from "../components/buttons/RegularButton";
import useDebounce from "../hooks/useDebounce";
import { AuthStore } from "../stores/authStore";
import { StoryStore } from "../stores/storyStore";

const ComposeBlogPage = () => {
	const [preview, setPriview] = useState<boolean>(false);
	const [topic, setTopic] = useState<string>("");
	const [coverImageLocal, setCoverImageLocal] = useState<string>("");
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const storyStore = StoryStore();
	const authStore = AuthStore();

	const formik = useFormik<updateStorySchemaType>({
		initialValues: {
			id: id || "",
			title: "",
			content: "",
			description: "",
			published: false,
			topics: [""],
			coverImg: "",
		},
		validateOnBlur: false,
		validateOnChange: false,
		onSubmit: async (values) => {
			const formData = valueToFormData(values);
			formData.set("published", "true");
			const flag = await toast.promise(storyStore.putStory(formData), {
				loading: "Posting...",
				success: "New Blog Posted",
				error: "Error Posting Story!",
			});
			if (flag) {
				navigate("/");
			}
		},
	});

	useEffect(() => {
		if (!authStore.isLoggedIn) {
			toast.error("Sign in first!");
			navigate("/signin");
		} else {
			get();
		}

		async function get() {
			if (id) {
				const story = await storyStore.getStory({ id });
				if (story) formik.setValues(story as updateStorySchemaType);
			}
		}

		// return () => {

		// 	if (formik.values.title == "" && formik.values.content == "" && id) {
		// 		console.log(formik.values);
		// 		store.deleteBlog({ id });
		// 	}
		// };
	}, []);

	// Debounce effect
	const debouncedValues = useDebounce(formik.values, 5000);
	useEffect(() => {
		async function submitDebouncedValues() {
			const formData = valueToFormData(debouncedValues as updateStorySchemaType);
			formData.append("published", "false");
			await storyStore.putStory(formData);
		}

		if (debouncedValues) {
			submitDebouncedValues();
		}
	}, [debouncedValues]);

	// image upload logic
	const onImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		formik.setValues({ ...formik.values, coverImg: e.target.files ? e.target.files[0] : undefined });
		setCoverImageLocal(e.target.files ? URL.createObjectURL(e.target.files[0]) : "");
	};

	// topics list input logic
	const addTopic = () => {
		if (topic.trim() !== "" && (formik.values.topics == undefined || formik.values?.topics?.length < 5)) {
			const regex = /^[A-Z][a-z]+(?:[A-Z][a-z]+)*$/;
			if (regex.test(topic)) {
				formik.setValues({ ...formik.values, topics: [...formik.values.topics, topic] });
				setTopic("");
			} else {
				toast.error("Topic must be in capital camel case!");
			}
		}
	};
	const deleteTopic = (index: number) => {
		const updatedTopics = [...formik.values.topics];
		updatedTopics.splice(index, 1);
		formik.setValues({ ...formik.values, topics: updatedTopics });
	};

	// hable two nested form's submition
	const handleTopicKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault(); // Prevent form submission
			if (topic.trim() !== "") {
				addTopic(); // Manually submit inner form
			} else {
				formik.submitForm();
			}
		}
	};

	// adjusting height of input components according to its constent
	useEffect(() => {
		const title = document.getElementById("title") as HTMLTextAreaElement;
		const content = document.getElementById("content") as HTMLTextAreaElement;
		if (title && content) {
			title.style.height = "auto"; // Reset height to auto to recalculate scrollHeight
			title.style.height = `${title.scrollHeight}px`; // Set height to scrollHeight
			content.style.height = "auto"; // Reset height to auto to recalculate scrollHeight
			content.style.height = `${content.scrollHeight}px`; // Set height to scrollHeight
		}
	}, [formik.values.title, formik.values.content, preview]);

	return (
		<div className="ComposeBlogPage h-full w-full">
			<form className="min-h-full w-full flex flex-col items-center" onSubmit={formik.handleSubmit}>
				{!preview ? (
					<>
						<div className="header h-14 px-2  w-full max-w-6xl flex items-center fixed sm:px-5 backdrop-blur-[2px] bg-white bg-opacity-80">
							<div className="logo cursor-pointer hidden sm:block">
								<img src={logo} className="App-logo w-10 h-10" alt="logo" />
							</div>

							<div className="flex gap-6">
								<span className="hidden sm:block">Draft in {authStore.user?.userName}</span>
								{storyStore.putStoryLoading !== undefined &&
									(storyStore.putStoryLoading ? (
										<div className="saving text-gray-600">Saving...</div>
									) : (
										<div className="saving text-gray-600">Saved</div>
									))}
							</div>

							<div className="flex-1"></div>

							{/* Publish button */}
							<RegularButton
								text="Publish"
								bgColor="green"
								color="white"
								type="button"
								onClick={() => setPriview(true)}
							/>

							<MoreOptions />

							<NotificationButton />

							<div className="profile mx-1 w-8 h-8 p-0 cursor-pointer sm:mx-4 sm:w-9 sm:h-9">
								<img
									src={(authStore.user?.profileImg as string) || defaultProfile}
									alt="profile image"
									className="rounded-full"
								/>
							</div>
						</div>

						<div className="main-container min-h-screen h-auto px-2 w-full max-w-3xl flex flex-col pt-14">
							<textarea
								id="title"
								rows={1}
								placeholder="Title"
								className="resize-none outline-none px-2 pt-10 pb-3 text-4xl leading-[3rem] border-b border-slate-200 overflow-hidden font-Merriweather font-semibold"
								{...formik.getFieldProps("title")}
							></textarea>

							<textarea
								id="content"
								rows={1}
								placeholder="content"
								className="resize-none outline-none px-2 py-3 pt-8 mb-20 text-xl overflow-hidden text-gray-900 font-Merriweather font-light leading-9"
								{...formik.getFieldProps("content")}
							></textarea>
						</div>
					</>
				) : (
					<div className="preview w-screen h-screen flex justify-center pt-20">
						<div className="main-container w-full h-fit max-w-5xl flex flex-col md:flex-row relative">
							{/* close button */}
							<div className="cross absolute top-[-40px] right-4">
								<CrossCloseButton type="button" onClick={() => setPriview(false)} />
							</div>

							<div className="preview h-full flex-1 flex flex-col  gap-2 px-4 mb-20 md:mb-0 md:px-10">
								<h2 className="font-semibold">Story Preview</h2>

								<label htmlFor="coverImg" className="h-[200px] w-full mx-auto ">
									{formik.values.coverImg === "" && coverImageLocal === "" ? (
										<div className="w-full h-full bg-slate-100 rounded-sm flex items-center justify-center text-gray-500 text-sm text-center px-10">
											Include a high-quality image in your story to make it more
											inviting to readers.
										</div>
									) : (
										<div className="w-full h-full bg-slate-100">
											<img
												src={
													coverImageLocal === ""
														? (formik.values.coverImg as string)
														: coverImageLocal
												}
												alt="cover image"
												className="max-w-full h-full mx-auto"
											/>
										</div>
									)}
								</label>

								<input type="file" id="coverImg" className="hidden" onChange={onImgUpload} />

								<textarea
									id="title"
									rows={2}
									placeholder="Title"
									{...formik.getFieldProps("title")}
									className="outline-none resize-none text-xl py-2 font-semibold border-b-2 border-neutral-200 font-Merriweather"
								/>

								<textarea
									id="description"
									maxLength={140}
									rows={5}
									placeholder="Description"
									{...formik.getFieldProps("description")}
									className="outline-none py-1 resize-none font-Merriweather"
								></textarea>

								<div className="note border-t-2 border-neutral-200 pt-1 text-gray-500">
									<span className="font-semibold">Note: </span>Changes here will affect how
									your story appears in public places like Medium’s homepage and in
									subscribers’ inboxes — not the contents of the story itself.
								</div>
							</div>

							<div className="add-topics h-fit flex-1 px-4 flex flex-col gap-4 mb-20 md:mb-0 md:px-10">
								<div>
									Publishing To:{" "}
									<span className="font-semibold">{authStore.user?.userName}</span>
								</div>

								<div className="font-sm">
									Add or change topics (up to 5) so readers know what your story is about.
								</div>

								<div className="topics flex flex-col">
									<form className="input flex gap-3">
										<input
											type="text"
											name="topic"
											id="topic"
											value={topic}
											placeholder="Add topic here..."
											className="flex-1 outline-none bg-slate-100 px-6 py-2 rounded-3xl"
											onChange={(e) => setTopic(e.target.value)}
											onKeyDown={handleTopicKeyDown}
										/>

										<RegularButton
											text="Add"
											bgColor="white"
											color="black"
											borderColor="black"
											onClick={() => {
												if (formik.values.topics == undefined)
													formik.values.topics = [];
												if (formik.values.topics.length < 5) addTopic();
												setTopic("");
											}}
										/>
									</form>

									<div className="topics flex flex-col gap-1 pt-4 px-6">
										{formik.values.topics?.map((topic, index) => {
											return (
												<div className="flex justify-between" key={index}>
													<div>{topic}</div>

													<CrossCloseButton
														type="button"
														onClick={() => {
															deleteTopic(index);
														}}
													/>
												</div>
											);
										})}
									</div>
								</div>

								<RegularButton
									text="Publish Now"
									type="submit"
									bgColor="green"
									color="white"
								/>
							</div>
						</div>
					</div>
				)}
			</form>
		</div>
	);
};

export default ComposeBlogPage;

function valueToFormData(values: updateStorySchemaType): FormData {
	const formData = new FormData();
	formData.append("id", values.id as string);
	formData.append("title", values.title);
	formData.append("content", values.content || "");
	formData.append("description", values.description);
	formData.append("topics", values.topics?.join(",") || "");
	formData.append("coverImg", values.coverImg || "");
	return formData;
}
