import type { FieldApi } from "@tanstack/react-form";
import { Alert } from "react-daisyui";
export const FieldInfo = ({
	field,
	// biome-ignore lint/suspicious/noExplicitAny: Passing type for Error is overkill as of now <explanation>
}: { field: FieldApi<any, any, any, any> }) => {
	return (
		<>
			{field.state.meta.isTouched && field.state.meta.errors.length ? (
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
					<span>{field.state.meta.errors.join(",")}</span>
				</Alert>
			) : null}
			{field.state.meta.isValidating ? "Validating..." : null}
		</>
	);
};
