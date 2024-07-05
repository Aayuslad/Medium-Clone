import ReCAPTCHA from "react-google-recaptcha";

function ReCAPTCHAWidget({ setToken }: { setToken: React.Dispatch<React.SetStateAction<string>> }) {
	return (
		<ReCAPTCHA
			theme="light"
			sitekey="6LdvSQkqAAAAAEfbZEv6tg-pLCH92zzvBson4p43"
			onChange={(token) => {
				token && setToken(token);
			}}
		/>
	);
}

export default ReCAPTCHAWidget;
