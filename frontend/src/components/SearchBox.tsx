import { useFormik } from "formik";
import { UsersStore } from "../stores/usersStore";
import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import ProfileIcon from "./ProfileIcon";
import defaultProfuleImg from "../assets/defaultProfile.jpg";
import { useNavigate } from "react-router-dom";
import { searchResultType } from "../stores/usersStore";

const SearchBox = () => {
	const usersStore = UsersStore();
	const navigate = useNavigate();
	const [result, setResult] = useState<searchResultType>();

	const formik = useFormik({
		initialValues: {
			searchQuery: "",
		},
		onSubmit: async (values) => {
			// usersStore.globalSearch(values);
			navigate(`/SearchResult/${values.searchQuery}/Stories`);
		},
	});

	const debouncedValues = useDebounce(formik.values.searchQuery, 500);
	useEffect(() => {
		async function fetchData() {
			const result = await usersStore.globalSearch({ searchQuery: formik.values.searchQuery });
			setResult(result);
		}

		if (debouncedValues) fetchData();
	}, [debouncedValues]);	

	return (
		<form className="searchBox items-center gap-2 relative w-full" onSubmit={formik.handleSubmit}>
			<div className="icon absolute h-full flex items-center left-3">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M4.1 11.06a6.95 6.95 0 1 1 13.9 0 6.95 6.95 0 0 1-13.9 0zm6.94-8.05a8.05 8.05 0 1 0 5.13 14.26l3.75 3.75a.56.56 0 1 0 .8-.79l-3.74-3.73A8.05 8.05 0 0 0 11.04 3v.01z"
						fill="currentColor"
					/>
				</svg>
			</div>
			<input
				type="text"
				placeholder="Search"
				{...formik.getFieldProps("searchQuery")}
				className="bg-stone-100 px-4 py-2 pl-12 w-full rounded-full outline-none"
			/>

			{result && (
				<div className="resultBox absolute bg-white py-5 px-4 w-[350px] rounded-lg shadow-lg top-12 left-0">
					<h3 className="text-sm text-gray-500 font-semibold pb-1 border-b border-gray-200 tracking-widest">
						PEOPLE
					</h3>
					<div className="peoples py-2">
						{result?.authors?.map((author) => {
							return (
								<div
									className="flex gap-3 py-1 cursor-pointer"
									onClick={() => navigate(`user/${author.id}/Home`)}
								>
									<ProfileIcon
										profileImg={author.profileImg || defaultProfuleImg}
										heightWidth={6}
										marginX={false}
									/>
									<div>{author.userName}</div>
								</div>
							);
						})}
					</div>
					<h3 className="text-sm text-gray-500 font-semibold pb-1 border-b border-gray-200 tracking-widest">
						TOPICS
					</h3>
					<div className="topics py-2">
						{result?.topics.map((topic) => {
							return (
								<div
									className="flex items-center gap-3 py-1 cursor-pointer"
									onClick={() => navigate(`topic/${topic.topic}`)}
								>
									<div className="flex items-center px-1">
										<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
											<path
												fill-rule="evenodd"
												clip-rule="evenodd"
												d="M3 14V2h10v12H3zM2.75 1a.75.75 0 0 0-.75.75v12.5c0 .41.34.75.75.75h10.5c.41 0 .75-.34.75-.75V1.75a.75.75 0 0 0-.75-.75H2.75zM5 10.5a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zM4.5 9c0-.28.22-.5.5-.5h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm1.25-2.5h4.5c.14 0 .25-.11.25-.25v-1.5a.25.25 0 0 0-.25-.25h-4.5a.25.25 0 0 0-.25.25v1.5c0 .14.11.25.25.25z"
												fill="currentColor"
											></path>
										</svg>
									</div>
									<div>{topic.topic}</div>
								</div>
							);
						})}
					</div>
					<h3 className="text-sm text-gray-500 font-semibold pb-1 border-b border-gray-200 tracking-widest">
						STORIES
					</h3>
					<div className="stories pt-2">
						{result?.stories?.map((story) => {
							return (
								<div
									onClick={() => navigate(`story/${story.id}`)}
									className="cursor-pointer py-1 text-sm"
								>
									{story.title}
								</div>
							);
						})}
					</div>
				</div>
			)}
		</form>
	);
};

export default SearchBox;
