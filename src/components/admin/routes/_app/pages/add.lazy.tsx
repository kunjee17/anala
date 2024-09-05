import { createLazyFileRoute } from "@tanstack/react-router";
import { AddOrEdit } from "../../../pages";

export const Route = createLazyFileRoute("/_app/pages/add")({
	component: Add,
});

function Add() {
	const navigate = Route.useNavigate();
	return (
		<AddOrEdit
			initialData={null}
			successFn={async () => {
				await navigate({
					to: "/pages",
				});
			}}
		/>
	);
}
