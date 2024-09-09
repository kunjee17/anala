import { createLazyFileRoute } from "@tanstack/react-router";
import { AddOrEdit } from "../../../posts";

export const Route = createLazyFileRoute("/_app/posts/add")({
	component: Add,
});

function Add() {
	const navigate = Route.useNavigate();
	return (
		<AddOrEdit
			initialData={null}
			successFn={async () => {
				await navigate({
					to: "/posts",
				});
			}}
		/>
	);
}
