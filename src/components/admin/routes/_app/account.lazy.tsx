import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_app/account")({
	component: () => <div>Hello /_app/account!</div>,
});
