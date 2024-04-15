import toast from "react-hot-toast";

interface FormValues {
	email?: string;
	userName?: string;
	emailOrName?: string;
	password?: string;
}

// validating registration form
export async function sinUpValidation(values: FormValues) {
	const error: Partial<FormValues> = usernameVerify({}, values);
	if (error.userName) return error;
	emailVerify(error, values);
	if (error.email) return error;
	passwordVerify(error, values);

	return error;
}

// validating registration form
export async function sinInValidation(values: FormValues) {
	const error: Partial<FormValues> = nameOrEmailVerify({}, values);
	if (error.emailOrName) return error;
	passwordVerify(error, values);

	return error;
}

// All the functions (Logic) starts from here

// validate email
function emailVerify(error: Partial<FormValues> = {}, values: FormValues) {
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	if (values?.email?.includes(" ")) {
		error.email = toast.error("Invalid email address");
	} else if (!emailRegex.test(values.email as string)) {
		error.email = toast.error("Invalid email address");
	}

	return error;
}

// validate password
function passwordVerify(error: Partial<FormValues> = {}, values: FormValues) {
	const specialCharactorsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

	if (values.password?.includes(" ")) {
		error.password = toast.error("Invalid password");
	} else if (values?.password?.length !== undefined && values.password.length < 6) {
		error.password = toast.error("Minimum 6 digits required");
	} else if (!specialCharactorsRegex.test(values.password as string)) {
		error.password = toast.error("Password must have special characters");
	}

	return error;
}

// validate username
function usernameVerify(error: Partial<FormValues> = {}, values: FormValues) {
	if (values.userName?.includes(" ")) {
		error.userName = toast.error("Invalid username");
	}

	return error;
}

// validate username
function nameOrEmailVerify(error: Partial<FormValues> = {}, values: FormValues) {
	if (values.emailOrName?.includes(" ")) {
		error.emailOrName = toast.error("Invalid input in Username or email");
	}
 
	return error;
}