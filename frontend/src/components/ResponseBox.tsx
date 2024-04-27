import CrossCloseButton from "./buttons/CrossCloseButton";

type props = {
	commentBox: boolean;
	setCommentBox: React.Dispatch<React.SetStateAction<boolean>>;
};

const ResponseBox = ({ commentBox, setCommentBox }: props) => {
	return (
		<div
			className={`ResponseBox border border-black h-screen w-screen sm:w-[380px] fixed top-0 ${
				commentBox ? "right-0" : "right-[-100vw] sm:right-[-380px]"
			} z-10 duration-300  bg-white px-4 py-5`}
		>
			<div className="header flex justify-between items-center">
                <h3 className="font-semibold text-xl">Responses (3)</h3>
				<CrossCloseButton onClick={() => setCommentBox(false)} type="button" />
			</div>

            feture will added soon, the developer is working
		</div>
	);
};

export default ResponseBox;
