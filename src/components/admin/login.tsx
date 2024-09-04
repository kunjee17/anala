import { useForm } from "@tanstack/react-form";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import {
	type UserCredential,
	signInWithEmailAndPassword,
	signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { Alert, Button, Card, Form, Input } from "react-daisyui";
import * as v from "valibot";
import { getAuth, googleAuthProvider } from "../../firebase/client.ts";
import { FieldInfo } from "./fieldInfo.tsx";

type SignInDTO = {
	email: string;
	password: string;
};

const validateAndRedirect = async (userCredential: UserCredential) => {
	// Check if user email is validated email. Or allowed email

	const allowed_email_res = await fetch(
		`/api/auth/allowed-emails?email=${encodeURIComponent(userCredential.user.email || "")}`,
	);
	if (allowed_email_res.status === 404) {
		throw new Error("User Email Not Allowed in Allowed List");
	}
	const idToken = await userCredential.user.getIdToken();
	const params = new URLSearchParams(window.location.search);
	const redirectTo = params.get("redirect_to");
	const res = await fetch("/api/auth/login", {
		method: "GET",
		headers: {
			Authorization: `Bearer ${idToken}`,
			"x-redirect-to": redirectTo || "",
		},
	});
	if (!res.ok) {
		return await res.json();
	}

	if (res.redirected) {
		window.location.assign(res.url);
	}
};

const loginWithEmailPassword = async (dto: SignInDTO) => {
	const auth = await getAuth();
	const { email, password } = dto;
	const userCredential = await signInWithEmailAndPassword(
		auth,
		email,
		password,
	);

	await validateAndRedirect(userCredential);
};

const loginWithGoogle = async () => {
	const auth = await getAuth();
	const userCredential = await signInWithPopup(auth, googleAuthProvider);
	await validateAndRedirect(userCredential);
};

export const Login = () => {
	const [errorMsg, setErrorMsg] = useState("");
	const { handleSubmit, Field, Subscribe } = useForm<SignInDTO>({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			try {
				await loginWithEmailPassword(value);
			} catch (error: unknown) {
				const err = error as Error;
				setErrorMsg(err.message);
			}
		},
	});
	return (
		<div className="flex justify-center items-center w-full h-screen">
			<Card bordered={true}>
				<Card.Title className="justify-center items-center">Sign In</Card.Title>
				<Card.Body>
					<Form
						onSubmit={async (e) => {
							e.preventDefault();
							e.stopPropagation();
							await handleSubmit();
						}}
						className={"space-y-6"}
					>
						<Field
							name="email"
							validatorAdapter={valibotValidator()}
							validators={{
								onChange: v.pipe(v.string(), v.minLength(3), v.email()),
							}}
						>
							{(field) => (
								<>
									<Input
										type="email"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										className=""
										placeholder={"Email"}
									/>
									<FieldInfo field={field} />
								</>
							)}
						</Field>
						<Field
							name={"password"}
							validatorAdapter={valibotValidator()}
							validators={{
								onChange: v.pipe(v.string(), v.minLength(4)),
							}}
						>
							{(field) => (
								<>
									<Input
										type="password"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										className=""
										placeholder={"Password"}
									/>
									<FieldInfo field={field} />
								</>
							)}
						</Field>
						<Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
						>
							{([canSubmit, isSubmitting]) => (
								<Button type={"submit"} disabled={!canSubmit} color={"primary"}>
									{isSubmitting ? "..." : "Submit"}
								</Button>
							)}
						</Subscribe>
					</Form>
					<Button
						type={"button"}
						onClick={async () => {
							try {
								await loginWithGoogle();
							} catch (error: unknown) {
								const err = error as Error;
								setErrorMsg(err.message);
							}
						}}
					>
						<svg
							aria-hidden="true"
							focusable="false"
							data-prefix="fab"
							data-icon="google"
							className="w-5 h-5 mr-2 svg-inline--fa fa-google fa-w-16"
							role="img"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 488 512"
						>
							<title>Google Login Icon</title>
							<path
								fill="currentColor"
								d="M488 261.8C488 403.3 391.2 512 248 512 110.8 512 0 401.2 0 264S110.8 16 248 16c66.8 0 122.9 24.4 167.4 64.1l-67.9 64.7C319.2 105.5 286.8 96 248 96c-99.8 0-180.6 82.8-180.6 184s80.8 184 180.6 184c83.6 0 137.6-47.8 144-111H248v-89.5h240c2.3 13.7 4 27.3 4 41.8z"
							/>
						</svg>
						Sign in with Google
					</Button>
				</Card.Body>
				{errorMsg && (
					<Card.Actions>
						<Alert
							status={"error"}
							icon={
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="stroke-current shrink-0 h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
								>
									<title>Error Icon</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							}
						>
							{errorMsg}
						</Alert>
					</Card.Actions>
				)}
			</Card>
		</div>
	);
};
