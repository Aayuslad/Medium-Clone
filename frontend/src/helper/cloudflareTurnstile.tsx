import Turnstile from "react-turnstile";

function TurnstileWidget({ setToken }: { setToken: React.Dispatch<React.SetStateAction<string>> }) {
	return (
		<Turnstile
			theme="light"
			sitekey="0x4AAAAAAAeTdEvT5c0r7avD"
			onVerify={(token) => {
				setToken(token);
				console.log(token);
			}}
		/>
	);
}

export default TurnstileWidget;
