import { BlogType } from "@aayushlad/medium-clone-common";
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
import { AuthStore } from "../stores/authStore";
import { BlogStore } from "../stores/blogStore";

const ComposeBlogPage = () => {
	const [debounceTimeout, setDebounceTimeout] = useState<number | undefined>(undefined);
	const [preview, setPriview] = useState<boolean>(false);
	const [topic, setTopic] = useState<string>("");
	const [coverImageLocal, setCoverImageLocal] = useState<string>("");
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const blogStore = BlogStore();
	const authStore = AuthStore();

	const formik = useFormik<BlogType>({
		initialValues: {
			id: id || "",
			title: "",
			content: "",
			description: "",
			published: false,
			postedOn: "",
			topics: [""],
			coverImage: "",
		},
		validateOnBlur: false,
		validateOnChange: false,
		onSubmit: async (values) => {
			const formData = valueToFormData(values);
			formData.append("published", "true");
			const flag = await toast.promise(blogStore.putBlog(formData), {
				loading: "Posting...",
				success: "New Blog Posted",
				error: "Error Posting Blog!",
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
				const blog = await blogStore.getBlog({ id });
				if (blog) formik.setValues(blog);
			}
		}

		// return () => {

		// 	if (formik.values.title == "" && formik.values.content == "" && id) {
		// 		console.log(formik.values);
		// 		store.deleteBlog({ id });
		// 	}
		// };
	}, []);

	// decbounce effect
	useEffect(() => {
		return () => {
			if (debounceTimeout) clearTimeout(debounceTimeout); // Clear timeout on component unmount
		};
	}, [debounceTimeout]);

	const handleDebounce = async () => {
		if (debounceTimeout) clearTimeout(debounceTimeout);

		console.log("Handle debounce");

		const timeout = setTimeout(() => {
			async function post() {
				const formData = valueToFormData(formik.values);
				console.log(formik.values);
				await blogStore.putBlog(formData);
			}

			post();
		}, 2000);

		setDebounceTimeout(timeout);
	};

	// image upload logic
	const onImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		formik.setValues({ ...formik.values, coverImage: e.target.files ? e.target.files[0] : "" });
		setCoverImageLocal(e.target.files ? URL.createObjectURL(e.target.files[0]) : "");
	};

	// topics list input logic
	const addTopic = () => {
		if (topic.trim() !== "" && (formik.values.topics == undefined || formik.values?.topics?.length < 5)) {
			formik.setValues({ ...formik.values, topics: [...formik.values.topics, topic] });
			setTopic("");
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
		title.style.height = "auto"; // Reset height to auto to recalculate scrollHeight
		title.style.height = `${title.scrollHeight}px`; // Set height to scrollHeight
		content.style.height = "auto"; // Reset height to auto to recalculate scrollHeight
		content.style.height = `${content.scrollHeight}px`; // Set height to scrollHeight
	}, [formik.values.title, formik.values.content]);

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
								<span className="hidden sm:block">Draft in {authStore.user?.name}</span>
								{blogStore.savingPostLoading !== undefined &&
									(blogStore.savingPostLoading ? (
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

						<div
							className="main-container min-h-screen h-auto w-full max-w-3xl flex flex-col pt-14"
							onChange={handleDebounce}
						>
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

							<div
								className="preview h-full flex-1 flex flex-col  gap-2 px-4 mb-20 md:mb-0 md:px-10"
								onChange={handleDebounce}
							>
								<h2 className="font-semibold">Story Preview</h2>

								<label htmlFor="coverImg" className="h-[200px] w-full mx-auto ">
									{formik.values.coverImage === "" && coverImageLocal === "" ? (
										<div className="w-full h-full bg-slate-100 rounded-sm flex items-center justify-center text-gray-500 text-sm text-center px-10">
											Include a high-quality image in your story to make it more
											inviting to readers.
										</div>
									) : (
										<div className="w-full h-full bg-slate-100">
											<img
												src={
													coverImageLocal === ""
														? (formik.values.coverImage as string)
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
									<span className="font-semibold">{authStore.user?.name}</span>
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
												handleDebounce();
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
															handleDebounce();
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

function valueToFormData(values: BlogType): FormData {
	const formData = new FormData();
	formData.append("id", values.id as string);
	formData.append("title", values.title);
	formData.append("content", values.content || "");
	formData.append("description", values.description);
	formData.append("topics", values.topics?.join(",") || "");
	formData.append("coverImage", values.coverImage || "");
	return formData;
}
