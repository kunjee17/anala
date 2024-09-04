import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_app/users/")({
	component: () => <div>Hello /_app/users/!</div>,
});
