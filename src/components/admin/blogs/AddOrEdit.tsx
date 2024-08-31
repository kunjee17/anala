import { useForm } from "@tanstack/react-form";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { useState } from "react";
import { Alert, Button, Form, Input } from "react-daisyui";
import * as v from "valibot";
import { FieldInfo } from "../FieldInfo.tsx";
import type { BlogPost } from "./Types.ts";
import "@mdxeditor/editor/style.css";
import { slugToUrl, titleToSlug } from "../../../helpers";

import { collection, doc, writeBatch } from "firebase/firestore";
import { firestore } from "../../../firebase/client.ts";

const insertOrUpdateBlog = async (blog: BlogPost) => {
	console.log(blog);
	const batch = writeBatch(firestore);
	const blogs = collection(firestore, "posts");
	const blogDoc = blog.id ? doc(blogs, blog.id) : doc(blogs);
	batch.set(blogDoc, blog);

	await batch.commit();
};

export const AddOrEdit = ({
	initialData,
}: { initialData: BlogPost | undefined }) => {
	const [errorMsg, setErrorMsg] = useState("");
	const { Field, Subscribe, handleSubmit, setFieldValue, getFieldValue } =
		useForm<BlogPost>({
			defaultValues: initialData || {
				author: "",
				content: "",
				slug: "",
				tags: [],
				category: "",
				title: "",
				url: "",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			onSubmit: async ({ value }) => {
				console.log(value);
				try {
					await insertOrUpdateBlog({ updatedAt: new Date(), ...value });
					window.location.assign("/admin/blogs");
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
								onBlur={(e) => {
									const slug = titleToSlug(e.target.value);
									setFieldValue("slug", slug);
									setFieldValue(
										"url",
										slugToUrl(slug, getFieldValue("createdAt")),
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
								onBlur={(e) => {
									setFieldValue(
										"url",
										slugToUrl(e.target.value, getFieldValue("createdAt")),
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
							<Input
								type={"text"}
								value={field.state.value}
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
							<MarkdownEditor
								value={field.state.value}
								onBlur={field.handleBlur}
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
