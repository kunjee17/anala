import { useAsync, useMountEffect } from "@react-hookz/web";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Alert } from "react-daisyui";
import { getPostById } from "../../../../../firebase/client.ts";
import { AddOrEdit } from "../../../posts";

export const Route = createLazyFileRoute("/_app/posts/$id/edit")({
	component: Edit,
});

function Edit() {
	const { id } = Route.useParams();
	const [state, actions] = useAsync(() => getPostById(id));
	useMountEffect(actions.execute);

	if (state.status === "success") {
		return (
			<>
				{!state.result && (
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
						<span>No Post Found for Id {id}</span>
					</Alert>
				)}
				<AddOrEdit initialData={state.result} />
			</>
		);
	}

	return <div>Loading</div>;
}
