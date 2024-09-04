import { useForm } from "@tanstack/react-form";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { formatDate } from "date-fns";
import { useState } from "react";
import { Alert, Button, Form, Input } from "react-daisyui";
import * as v from "valibot";
import { slugToUrl, titleToSlug } from "../../../helpers";
import { FieldInfo } from "../fieldInfo.tsx";
import type { Post } from "./types.ts";

import { Timestamp } from "firebase/firestore";
import { insertOrUpdatePost } from "../../../firebase/client.ts";
import { timeStampToDate } from "../../../firebase/fireHelper.ts";

export const AddOrEdit = ({
	initialData,
}: { initialData: Post | null | undefined }) => {
	const [errorMsg, setErrorMsg] = useState("");

	const { Field, Subscribe, handleSubmit, setFieldValue, getFieldValue } =
		useForm<Post>({
			defaultValues: initialData || {
				author: "",
				content: "",
				slug: "",
				tags: [],
				category: "",
				title: "",
				url: "",
				createdAt: Timestamp.now(),
				updatedAt: Timestamp.now(),
			},
			onSubmit: async ({ value }) => {
				console.log(value);
				try {
					await insertOrUpdatePost({ updatedAt: Timestamp.now(), ...value });
					window.location.assign("/admin/posts");
				} catch (err: unknown) {
					const e = err as Error;
					setErrorMsg(e.message);
				}
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
							<label className={"label label-text"}>Author</label>
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
							<label className={"label label-text"}>Title</label>
							<Input
								type={"text"}
								value={field.state.value}
								onBlur={(e) => {
									const slug = titleToSlug(e.target.value);
									setFieldValue("slug", slug);
									setFieldValue(
										"url",
										slugToUrl(
											slug,
											timeStampToDate(getFieldValue("createdAt")),
										),
									);
									field.handleBlur();
								}}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder={"title"}
							/>
							<FieldInfo field={field} />
						</>
					)}
				</Field>
				<Field name={"createdAt"}>
					{(field) => (
						<>
							<label className={"label label-text"}>Created At</label>
							<Input
								type={"date"}
								value={formatDate(
									timeStampToDate(field.state.value),
									"yyyy-MM-dd",
								)}
								onBlur={field.handleBlur}
								onChange={(e) =>
									field.handleChange(
										Timestamp.fromDate(new Date(e.target.value)),
									)
								}
							/>
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
							<label className={"label label-text"}>Slug</label>
							<Input
								type={"text"}
								value={field.state.value}
								onBlur={(e) => {
									setFieldValue(
										"url",
										slugToUrl(
											e.target.value,
											timeStampToDate(getFieldValue("createdAt")),
										),
									);
									field.handleBlur();
								}}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder={"Slug"}
							/>
							<FieldInfo field={field} />
						</>
					)}
				</Field>
				<Field name={"tags"}>
					{(field) => (
						<>
							<label className={"label label-text"}>Comma Seperated Tags</label>
							<Input
								type={"text"}
								value={field.state.value.join(", ")}
								onBlur={field.handleBlur}
								onChange={(e) =>
									field.handleChange(
										e.target.value.split(",").map((x) => x.trim()),
									)
								}
								placeholder={"Comma Seperated Tags"}
							/>
							<FieldInfo field={field} />
						</>
					)}
				</Field>
				<Field
					name={"category"}
					validatorAdapter={valibotValidator()}
					validators={{
						onChange: v.pipe(v.string(), v.minLength(3)),
					}}
				>
					{(field) => (
						<>
							<label className={"label label-text"}>Category</label>
							<Input
								type={"text"}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder={"Category"}
							/>
							<FieldInfo field={field} />
						</>
					)}
				</Field>
				<Field
					name={"content"}
					validatorAdapter={valibotValidator()}
					validators={{
						onChange: v.pipe(v.string(), v.minLength(5)),
					}}
				>
					{(field) => (
						<>
							<label className={"label label-text"}>Markdown Content</label>
							<MarkdownEditor
								value={field.state.value}
								onBlur={field.handleBlur}
								height={"300px"}
								onChange={(value, viewUpdate) => {
									console.log("ViewUpdate", viewUpdate);
									field.handleChange(value);
								}}
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
