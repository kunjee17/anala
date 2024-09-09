import { useForm } from "@tanstack/react-form";
import { createLazyFileRoute } from "@tanstack/react-router";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import { useState } from "react";
import { Button, Card, Form, Input } from "react-daisyui";
import * as v from "valibot";
import { ErrorMsg } from "../components/errorMsg.tsx";
import { FieldInfo } from "../components/fieldInfo.tsx";
import { GoogleLoginButton } from "../components/googleLoginButton.tsx";
import { type SignInDTO, useAuth } from "../providers/auth.tsx";

export const Route = createLazyFileRoute("/login")({
	component: Login,
});

function Login() {
	const [errorMsg, setErrorMsg] = useState("");
	const { loading, loginWithEmailPassword, loginWithGoogle } = useAuth();
	const navigate = Route.useNavigate();

	const login = async (value: SignInDTO | null | undefined) => {
		try {
			if (value) {
				await loginWithEmailPassword(value);
			} else {
				await loginWithGoogle();
			}
			await navigate({ to: "/dashboard" });
		} catch (error: unknown) {
			const err = error as Error;
			setErrorMsg(err.message);
		}
	};

	const { handleSubmit, Field, Subscribe } = useForm<SignInDTO>({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			await login(value);
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
								<Button
									loading={loading}
									type={"submit"}
									disabled={!canSubmit}
									color={"primary"}
								>
									{isSubmitting ? "..." : "Submit"}
								</Button>
							)}
						</Subscribe>
					</Form>
					<GoogleLoginButton
						loading={loading}
						login={async () => {
							await login(null);
						}}
					/>
				</Card.Body>
				{errorMsg && (
					<Card.Actions>
						<ErrorMsg errorMsg={errorMsg} />
					</Card.Actions>
				)}
			</Card>
		</div>
	);
}
