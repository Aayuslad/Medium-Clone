import { AuthStore} from "../../stores/authStore";

const SignOutBtnWithEmail = () => {
	const authStore = AuthStore();

	return (
		<button className="sign-out text-black flex flex-col gap-1 py-2 px-5 cursor-pointer" onClick={() => authStore.signOut()}>
			<span>Sign out</span>
			<span className="text-sm">{authStore.user?.email}</span>
		</button>
	);
};

export default SignOutBtnWithEmail;
