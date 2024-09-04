import { createLazyFileRoute } from "@tanstack/react-router";
import { AddOrEdit } from "../../../posts";

export const Route = createLazyFileRoute("/_app/posts/add")({
	component: () => <AddOrEdit initialData={null} />,
});
