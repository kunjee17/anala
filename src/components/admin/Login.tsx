import { useForm } from "@tanstack/react-form";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import {
	browserSessionPersistence,
	getAuth,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { Alert, Button, Card, Form, Input } from "react-daisyui";
import * as v from "valibot";
import { app } from "../../firebase/client.ts";
import { FieldInfo } from "./FieldInfo.tsx";

type SignInDTO = {
	email: string;
	password: string;
};

const postFromData = async (dto: SignInDTO) => {
	const auth = getAuth(app);
	/* This will set the persistence to session */
	await auth.setPersistence(browserSessionPersistence);
	const { email, password } = dto;
	const userCredential = await signInWithEmailAndPassword(
		auth,
		email,
		password,
	);

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

export const Login = () => {
	const [errorMsg, setErrorMsg] = useState("");
	const { handleSubmit, Field, Subscribe } = useForm<SignInDTO>({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			try {
				await postFromData(value);
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
