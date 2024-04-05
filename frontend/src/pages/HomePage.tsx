import { useEffect } from "react";
import BlogPreview from "../components/BlogPreview";
import Header from "../components/Header";
import useScrollDirection from "../hooks/useScrollDirection";
import { blogStore } from "../stores/blogStore";

const HomePage = () => {
	const BlogStore = blogStore();
	const scrollDirection = useScrollDirection();

	useEffect(() => {
		BlogStore.getBlogs();
	}, []);

	return (
		<div className="HomePage " style={{ cursor: BlogStore.cursorLoading ? "wait" : "default" }}>
			<Header />

			<div className="main-container w-full flex-1 max-w-6xl mx-auto mt-14 flex border border-black">
				<div className="post-container border flex-1 border-red-600">
					<div
						className={`topics border border-green-500 h-10 w-full sticky ${
							scrollDirection === "down" ? "top-0" : "top-14"
						} duration-500 bg-white `}
					></div>

					{BlogStore.feedBlogs?.map((blog, index) => {
						return <BlogPreview blog={blog} index={index} />;
					})}
				</div>

				<div className="side-container border w-96 border-red-600 hidden overflow-y-scroll lg:block">
					sidebar Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto aperiam
					perferendis doloremque, culpa nulla magnam modi quisquam vitae praesentium atque dolorum
					asperiores corporis illum maxime. Qui dolor dignissimos inventore nemo sit dolore veniam
					iste dolorem recusandae labore. Aspernatur possimus, error aliquid porro consequuntur quas
					nisi voluptatem numquam quidem laboriosam nemo dignissimos voluptates natus accusantium
					excepturi inventore animi esse? Eveniet inventore facilis error nulla vel. Voluptatum
					quibusdam minus amet cum. Earum cupiditate velit deleniti amet doloremque commodi, nisi
					quos laboriosam fuga sequi natus qui quidem exercitationem sunt cum delectus, explicabo
					architecto illum! Labore, perspiciatis rerum similique, ullam quo commodi illum voluptas
					ratione natus temporibus aut optio ut ad repellendus perferendis doloremque beatae nihil
					incidunt nulla porro dolor quidem cupiditate distinctio! Quo, vero a numquam aperiam
					accusantium reprehenderit magni velit voluptatem quas maiores beatae repudiandae
					voluptates delectus vitae ea! Est, rem? Veritatis nam, minus libero commodi explicabo
					voluptatibus sed minima sint est totam dolore beatae distinctio, delectus vel recusandae,
					impedit eaque ex expedita et. Autem ipsum praesentium, perspiciatis sit vero, quaerat
					vitae libero earum ab eaque necessitatibus expedita similique ullam corrupti asperiores!
					Voluptates sunt nesciunt maxime reprehenderit animi doloremque iste voluptatum, odit
					perferendis nobis quia deleniti at voluptas. Fugit mollitia enim iusto voluptas nisi nam
					magnam iste fugiat? Magni iusto vero provident voluptas tempora culpa corporis quidem odio
					autem architecto at, itaque quia non mollitia explicabo libero dolore error impedit
					quisquam quasi ratione. Quibusdam pariatur iusto quisquam soluta omnis, ab ad earum
					laudantium iste, aliquam, dignissimos fuga nostrum non tempora. Asperiores dolorem ullam
					fugiat deleniti id, molestias repudiandae laudantium illo sed esse natus facere veritatis
					debitis, quos amet fuga! Veniam, consequatur possimus, atque enim blanditiis inventore
					deserunt accusamus explicabo quos, ratione quas quisquam. Quasi doloribus sequi expedita
					tempore. Inventore minus ipsa modi. Quas animi minima fugit, omnis maiores tenetur
					explicabo beatae placeat!
				</div>
			</div>
		</div>
	);
};

export default HomePage;
