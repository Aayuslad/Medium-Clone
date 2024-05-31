import { AuthStore } from "../stores/authStore";

type props = {
	writerName: string;
	setEditingResponse: React.Dispatch<React.SetStateAction<boolean>>;
	setDropdown: React.Dispatch<React.SetStateAction<boolean>>;
	setDeletingResponse: React.Dispatch<React.SetStateAction<boolean>>;
};

const ResponseDropdown = ({ writerName, setEditingResponse, setDeletingResponse, setDropdown }: props) => {
	const authStore = AuthStore();

	return (
		<div className="dropdown absolute top-6 right-3 pr-7 py-3 px-4 rounded bg-white custom-box-shadow flex flex-col gap-2">
			{authStore?.user?.userName !== writerName && (
				<div className="text-gray-800 hover:text-black cursor-pointer">Report This</div>
			)}
			{authStore?.user?.userName === writerName && (
				<div
					className="text-gray-800 hover:text-black cursor-pointer"
					onClick={() => {
						setEditingResponse((state) => !state);
						setDropdown(false);
					}}
				>
					Edit this response
				</div>
			)}
			{authStore?.user?.userName === writerName && (
				<div
					className="text-gray-800 hover:text-black cursor-pointer"
					onClick={() => {
						setDeletingResponse((state) => !state);
						setDropdown(false);
					}}
				>
					Delete
				</div>
			)}
		</div>
	);
};

export default ResponseDropdown;
