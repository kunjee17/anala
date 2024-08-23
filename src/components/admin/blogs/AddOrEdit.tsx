import { useForm } from "@tanstack/react-form";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import { useState } from "react";
import { Alert, Button, Form, Input } from "react-daisyui";
import * as v from "valibot";
import { FieldInfo } from "../FieldInfo.tsx";
import type { BlogPost } from "./Types.ts";

export const AddOrEdit = ({ id }: { id: string | undefined }) => {
	const [errorMsg, setErrorMsg] = useState("");
	const { Field, Subscribe, handleSubmit } = useForm<BlogPost>({
		defaultValues: {
			author: "",
			content: "",
			slug: "",
			title: "",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		onSubmit: async ({ value }) => {
			console.log(value);
		},
	});
	return (
		<>
			<Form
				onSubmit={async (e) => {
					e.preventDefault();
					e.stopPropagation();
					await handleSubmit();
				}}
			>
				<Field
					name={"author"}
					validatorAdapter={valibotValidator()}
					validators={{
						onChange: v.pipe(v.string(), v.minLength(3)),
					}}
				>
					{(field) => (
						<>
							<Input
								type={"text"}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder={"author"}
							/>
							<FieldInfo field={field} />
						</>
					)}
				</Field>
				<Field
					name={"title"}
					validatorAdapter={valibotValidator()}
					validators={{
						onChange: v.pipe(v.string(), v.minLength(10)),
					}}
				>
					{(field) => (
						<>
							<Input
								type={"text"}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder={"title"}
							/>
							<FieldInfo field={field} />
						</>
					)}
				</Field>
				<Field
					name={"slug"}
					validatorAdapter={valibotValidator()}
					validators={{
						onChange: v.pipe(v.string(), v.minLength(10)),
					}}
				>
					{(field) => (
						<>
							<Input
								type={"text"}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder={"slug"}
							/>
							<FieldInfo field={field} />
						</>
					)}
				</Field>
				<Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
					{([canSubmit, isSubmitting]) => (
						<Button type={"submit"} disabled={!canSubmit} color={"primary"}>
							{isSubmitting ? "..." : "Submit"}
						</Button>
					)}
				</Subscribe>
			</Form>
			{errorMsg && (
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
					{errorMsg}{" "}
				</Alert>
			)}
		</>
	);
};
