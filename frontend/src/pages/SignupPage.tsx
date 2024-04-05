import { Input } from "../components/Input";
import { Footer } from "../components/Footer";
import { BlackButton } from "../components/BlackButton";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { signUpSchemaType } from "@aayushlad/medium-clone-common";
import { authStore } from "../stores/authStore";
import logo from "../assets/logo.svg";

function signup() {
	const navigate = useNavigate();
	const store = authStore();

	const formik = useFormik<signUpSchemaType>({
		initialValues: {
			name: "",
			email: "",
			password: "",
		},
		validateOnBlur: false,
		validateOnChange: false,
		onSubmit: async (values) => {
			console.log(values);
			store.signup(values, navigate);
		},
	});

	return (
		<>
			<div className="SignupPage w-screen h-screen flex flex-col">
				<div className="Header w-screen h-16 flex items-center gap-1 border-b-2 border-neutral-300 px-5">
					<div className="logo">
						<img src={logo} className="App-logo w-10 h-10" alt="logo" />
					</div>
					<h2 className="text-3xl font-semibold">Welcome to Medium</h2>
				</div>
				<div className="Content w-screen h-screen flex border">
					<div className="left h-full flex-1 bg-slate-100 hidden md:flex items-center justify-center">
						<h3 className="text-5xl px-10 font-bold">
							Create an account to <br /> receive the best stories <br /> on the internet
						</h3>
					</div>
					<div className="right h-full flex-1">
						<form
							className="signup h-full flex flex-col items-center justify-center gap-5"
							onSubmit={formik.handleSubmit}
						>
							<div className="formHeader pb-4">
								<h3 className="font-semibold text-gray-500 text-xl text-center">
									Enter your information to create an account
								</h3>
							</div>
							<Input label="Username" type="text" field={formik.getFieldProps("name")} />
							<Input label="Email" type="email" field={formik.getFieldProps("email")} />
							<Input
								label="Password"
								type="password"
								field={formik.getFieldProps("password")}
							/>
							<BlackButton type={"submit"}>Sign up</BlackButton>
							<div className="text-center text-sm text-gray-500 font-semibold">
								Already have an account?{" "}
								<Link to={`/signin`} className="text-black underline">
									Sign in
								</Link>
							</div>
						</form>
					</div>
				</div>
				<Footer />
			</div>
		</>
	);
}

export default signup;
