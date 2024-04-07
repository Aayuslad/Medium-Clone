import { Input } from "../components/Input";
import { Footer } from "../components/Footer";
import { BlackButton } from "../components/buttons/BlackButton";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { authStore } from "../stores/authStore";
import logo from "../assets/logo.svg";
import { sinInValidation } from "../helper/inputValidation";
import { signinSchemaType } from "@aayushlad/medium-clone-common";

function signin() {
	const store = authStore();
	const navigate = useNavigate();

	const formik = useFormik<signinSchemaType>({
		initialValues: {
			password: "",
			emailOrName: "",
		},
		validateOnBlur: false,
		validateOnChange: false,
		validate: sinInValidation,
		onSubmit: async (values) => {
			console.log(values);
			store.signin(values, navigate);
		},
	});

	return (
		<>
			<div className="SigninPage w-screen h-screen flex flex-col">
				<div className="Header w-screen h-16 flex items-center gap-1 border-b-2 border-neutral-300 px-5">
					<div className="logo">
						<img src={logo} className="App-logo w-10 h-10" alt="logo" />
					</div>
					<h2 className="text-3xl font-semibold">Welcome to Medium</h2>
				</div>
				<div className="Content w-screen h-screen flex border">
					<div className="left h-full flex-1 bg-slate-100 hidden md:flex items-center justify-center">
						<h3 className="text-5xl px-16 font-bold">
							Welcome back! <br /> Sign in to explore stories and connect with the community
						</h3>
					</div>
					<div className="right h-full flex-1">
						<form
							className="signup h-full flex flex-col items-center justify-center gap-5"
							onSubmit={formik.handleSubmit}
						>
							<div className="formHeader pb-4">
								<h3 className="font-semibold text-gray-500 text-xl px-3 text-center">
									Enter your information to access your account
								</h3>
							</div>
							<Input
								label="Username or Email"
								type="text"
								required={true}
								field={formik.getFieldProps("emailOrName")}
							/>
							<Input
								label="Password"
								type="password"
								required={true}
								field={formik.getFieldProps("password")}
							/>
							<BlackButton type={"submit"}>Sign in</BlackButton>
							<div className="text-center text-sm text-gray-500 font-semibold">
								Don't have an account?{" "}
								<Link to={`/signup`} className="text-black underline">
									Sign up
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

export default signin;
