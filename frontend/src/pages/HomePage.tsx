import { useEffect, useState } from "react";
import StoryPreview from "../components/StoryPreview";
import Header from "../components/Header";
import StorySkeletons from "../components/skelitons/StorySkeletons";
import useScrollDirection from "../hooks/useScrollDirection";
import { StoryStore } from "../stores/storyStore";
import MainConntainer from "../components/wrapperComponents/MainContainer";
import LeftContainer from "../components/wrapperComponents/LeftContainer";
import RightContainer from "../components/wrapperComponents/RightContainer";
import TopicsNavbar from "../components/navbars/TopicsNavbar";

const HomePage = () => {
	const storyStore = StoryStore();
	const scrollDirection = useScrollDirection();
	const [currentNav, setCurrentNav] = useState<string>("For you");

	useEffect(() => {
		if (storyStore.feedStories.length === 0) storyStore.getStories();
	}, []);

	return (
		<div className="HomePage" style={{ cursor: storyStore.cursorLoading ? "wait" : "default" }}>
			<Header />

			<MainConntainer>
				<LeftContainer>
					<div
						className={`topics z-0 h-fit sticky ${
							scrollDirection === "down" ? "top-0" : "top-14"
						} duration-200 bg-white relative`}
					>
						<TopicsNavbar currentNav={currentNav} setCurrentNav={setCurrentNav} navs={["Phychology", "Internet", "cars", "bikes", "BMW"]} />
					</div>

					{!storyStore.skelitonLoading &&
						storyStore.feedStories?.map((story, index) => {
							return <StoryPreview story={story} index={index} version="home" />;
						})}

					{storyStore.skelitonLoading && <StorySkeletons />}
				</LeftContainer>

				<RightContainer>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis porro at magni perspiciatis
					deleniti laudantium aut nulla beatae, exercitationem modi tempore explicabo laboriosam
					sequi saepe hic officia labore nisi error sed aperiam nihil, unde impedit doloribus. Magni
					hic eius reprehenderit numquam, sequi neque quos voluptatum laborum fuga quia, fugit iusto
					quasi voluptatibus repellendus molestiae odio. Sequi voluptatibus aliquid explicabo
					obcaecati quod labore quaerat consequuntur et tempore aspernatur dolorum fugiat fugit,
					amet asperiores. Sunt temporibus aut sint aliquam quaerat fuga hic rem at veritatis optio
					illum mollitia iusto, vero quos sapiente. Odit vel quam, quae libero reiciendis, sunt
					rerum aspernatur id laborum porro delectus eaque a expedita optio! Dicta ut tempora
					nesciunt, iusto dolorum repudiandae nihil officiis ducimus similique aliquam minus, quas
					cupiditate, dignissimos provident. Ipsum temporibus omnis totam aspernatur nam consequatur
					vel reiciendis sit similique perferendis, blanditiis quae voluptatibus neque facilis
					consequuntur atque vitae quasi voluptatem, eligendi, fugit illum! Error incidunt, dolore
					alias libero repellendus amet, officiis nostrum accusamus perferendis similique vitae sint
					voluptatem suscipit placeat, possimus atque asperiores aliquam cumque quod ea vero id quia
					modi? Quo dicta nulla voluptate eaque, illum atque, asperiores molestiae architecto rem
					officiis delectus, vel minima quos officia mollitia aspernatur porro magni quisquam ipsam!
				</RightContainer>
			</MainConntainer>
		</div>
	);
};

export default HomePage;
