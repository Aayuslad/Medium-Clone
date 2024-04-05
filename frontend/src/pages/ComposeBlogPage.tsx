import { useFormik } from "formik";
import logo from "../assets/logo.svg";
import { useEffect, useState } from "react";
import { blogStore } from "../stores/blogStore";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import authStore from "../stores/authStore";

type BlogType = {
	id?: string;
	title: string;
	content?: string;
	description: string;
	published?: boolean;
	postedOn?: string;
	topics: string[];
	author?: string;
	coverImage: string | File;
};

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

const ComposeBlogPage = () => {
	const [debounceTimeout, setDebounceTimeout] = useState<number | undefined>(undefined);
	const [preview, setPriview] = useState<boolean>(false);
	const [topic, setTopic] = useState<string>("");
	const [coverImageLocal, setCoverImageLocal] = useState<string>("");
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const store = blogStore();
	const AuthStore = authStore();

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
			values.published = true;
			console.log(values);
			const formData = valueToFormData(values);
			const flag = await toast.promise(store.putBlog(formData), {
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
		if (!AuthStore.isLoggedIn) {
			toast.error("Sign in first!");
			navigate("/signin");
		} else {
			get();
		}

		async function get() {
			if (id) {
				const blog = await store.getBlog({ id });
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
				await store.putBlog(formData);
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
						<div
							className="header h-14 px-2  w-full max-w-6xl flex items-center fixed sm:px-5"
							style={{
								backgroundColor: "rgba(255, 255, 255, 0.8)",
								backdropFilter: "blur(1px)",
							}}
						>
							<div className="logo cursor-pointer hidden sm:block">
								<img src={logo} className="App-logo w-10 h-10" alt="logo" />
							</div>

							<div className="flex gap-6">
								<span className="hidden sm:block">Draft in {AuthStore.user?.name}</span>
								{store.updatingPost !== undefined &&
									(store.updatingPost ? (
										<div className="saving text-gray-600">Saving...</div>
									) : (
										<div className="saving text-gray-600">Saved</div>
									))}
							</div>

							<div className="flex-1"></div>

							<button
								type="button"
								className="bg-green-600 px-3 py-2 mx-1 rounded-2xl text-sm leading-4 text-white sm:mx-4 sm:px-4 sm:py-2"
								onClick={() => setPriview(true)}
							>
								publish
							</button>

							<div className="dots mx-1 sm:mx-4">
								<svg className="svgIcon-use" width="25" height="25">
									<path
										d="M5 12.5c0 .552.195 1.023.586 1.414.39.39.862.586 1.414.586.552 0 1.023-.195 1.414-.586.39-.39.586-.862.586-1.414 0-.552-.195-1.023-.586-1.414A1.927 1.927 0 007 10.5c-.552 0-1.023.195-1.414.586-.39.39-.586.862-.586 1.414zm5.617 0c0 .552.196 1.023.586 1.414.391.39.863.586 1.414.586.552 0 1.023-.195 1.414-.586.39-.39.586-.862.586-1.414 0-.552-.195-1.023-.586-1.414a1.927 1.927 0 00-1.414-.586c-.551 0-1.023.195-1.414.586-.39.39-.586.862-.586 1.414zm5.6 0c0 .552.195 1.023.586 1.414.39.39.868.586 1.432.586.551 0 1.023-.195 1.413-.586.391-.39.587-.862.587-1.414 0-.552-.196-1.023-.587-1.414a1.927 1.927 0 00-1.413-.586c-.565 0-1.042.195-1.432.586-.39.39-.586.862-.587 1.414z"
										fillRule="evenodd"
									></path>
								</svg>
							</div>

							<div className="bell mx-4 cursor-pointer hidden sm:block">
								<div className="icon">
									<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
										<path
											d="M15 18.5a3 3 0 1 1-6 0"
											stroke="currentColor"
											strokeLinecap="round"
										></path>
										<path
											d="M5.5 10.53V9a6.5 6.5 0 0 1 13 0v1.53c0 1.42.56 2.78 1.57 3.79l.03.03c.26.26.4.6.4.97v2.93c0 .14-.11.25-.25.25H3.75a.25.25 0 0 1-.25-.25v-2.93c0-.37.14-.71.4-.97l.03-.03c1-1 1.57-2.37 1.57-3.79z"
											stroke="currentColor"
											strokeLinejoin="round"
										></path>
									</svg>
								</div>
							</div>

							<div className="profile mx-1 w-8 h-8 p-0 cursor-pointer sm:mx-4 sm:w-9 sm:h-9">
								<img
									src="https://miro.medium.com/v2/resize:fill:40:40/0*ks_bPGCSfXq0nrDO"
									alt=""
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
								className="resize-none outline-none px-2 py-3 mb-20 text-xl overflow-hidden text-gray-900 font-Merriweather font-light leading-9"
								{...formik.getFieldProps("content")}
							></textarea>
						</div>
					</>
				) : (
					<div className="preview w-screen h-screen flex justify-center pt-20">
						<div className="main-container w-full h-fit max-w-5xl flex flex-col md:flex-row relative">
							<button
								type="button"
								className="cross absolute top-[-40px] right-4"
								onClick={() => setPriview(false)}
							>
								<svg className="svgIcon-use" width="29" height="29">
									<path
										d="M20.13 8.11l-5.61 5.61-5.609-5.61-.801.801 5.61 5.61-5.61 5.61.801.8 5.61-5.609 5.61 5.61.8-.801-5.609-5.61 5.61-5.61"
										fill-rule="evenodd"
									></path>
								</svg>
							</button>

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
									<span className="font-semibold">{AuthStore.user?.name}</span>
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

										<button
											type="button"
											className="px-4 py-2 border border-black rounded-3xl"
											onClick={() => {
												if (formik.values.topics == undefined)
													formik.values.topics = [];
												if (formik.values.topics.length < 5) addTopic();
												handleDebounce();
												setTopic("");
											}}
										>
											Add
										</button>
									</form>
									<div className="topics flex flex-col gap-1 pt-4 px-6">
										{formik.values.topics?.map((topic, index) => {
											return (
												<div
													className="flex justify-between"
													key={index}
													onClick={() => {
														deleteTopic(index);
														handleDebounce();
													}}
												>
													<div>{topic}</div>

													<svg className="svgIcon-use" width="20" height="20">
														<path
															d="M20.13 8.11l-5.61 5.61-5.609-5.61-.801.801 5.61 5.61-5.61 5.61.801.8 5.61-5.609 5.61 5.61.8-.801-5.609-5.61 5.61-5.61"
															fill-rule="evenodd"
														></path>
													</svg>
												</div>
											);
										})}
									</div>
								</div>

								<button
									type="submit"
									className="bg-green-600 px-4 py-2 mx-10 mt-5 rounded-2xl text-sm leading-4 text-white md:w-fit md:mx-0"
								>
									Publish Now
								</button>
							</div>
						</div>
					</div>
				)}
			</form>
		</div>
	);
};

export default ComposeBlogPage;
