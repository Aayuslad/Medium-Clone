import authStore from "../../stores/authStore";

const SignOutBtnWithEmail = () => {
	const AuthStore = authStore();

	return (
		<button className="sign-out text-black flex flex-col gap-1 py-2 px-5 cursor-pointer" onClick={() => AuthStore.signOut()}>
			<span>Sign out</span>
			<span className="text-sm">aayushlad@gmail.com</span>
		</button>
	);
};

export default SignOutBtnWithEmail;
