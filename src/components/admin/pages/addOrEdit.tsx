import { useForm } from "@tanstack/react-form";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { useState } from "react";
import { Button, Form, Input } from "react-daisyui";
import * as v from "valibot";
import { insertOrUpdatePage } from "../../../firebase/client.ts";
import { ErrorMsg } from "../components/errorMsg.tsx";
import { FieldInfo } from "../components/fieldInfo.tsx";
import type { AnalaPage } from "./types.ts";

export const AddOrEdit = ({
	initialData,
	successFn,
}: { initialData: AnalaPage | undefined | null; successFn: () => void }) => {
	const [errorMsg, setErrorMsg] = useState<string>("");
	const { Field, Subscribe, handleSubmit } = useForm<AnalaPage>({
		defaultValues: initialData || {
			name: "",
			isVisible: true,
			isSystem: false,
			content: "",
			href: "",
			weight: 1,
		},
		onSubmit: async ({ value }) => {
			try {
				console.log(value);
				await insertOrUpdatePage(value);
				successFn();
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
					name={"name"}
					validatorAdapter={valibotValidator()}
					validators={{
						onChange: v.pipe(v.string(), v.minLength(3)),
					}}
				>
					{(field) => (
						<>
							<label className={"label label-text"}>Name</label>
							<Input
								type={"text"}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder={"name"}
							/>
							<FieldInfo field={field} />
						</>
					)}
				</Field>
				<Field
					name={"href"}
					validatorAdapter={valibotValidator()}
					validators={{
						onChange: v.pipe(v.string(), v.minLength(2)),
					}}
				>
					{(field) => (
						<>
							<label className={"label label-text"}>HREF / URL</label>
							<Input
								type={"text"}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder={"URL something like /about"}
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
							<label className={"label label-text"}>Page Content</label>
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
				<Field
					name={"weight"}
					validatorAdapter={valibotValidator()}
					validators={{
						onChange: v.pipe(v.number(), v.minValue(0)),
					}}
				>
					{(field) => (
						<>
							<label className={"label label-text"}>Weight</label>
							<Input
								type={"number"}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(Number(e.target.value))}
								placeholder={"Weight of Page"}
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
			<ErrorMsg errorMsg={errorMsg} />
		</>
	);
};
