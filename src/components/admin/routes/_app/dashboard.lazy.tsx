import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_app/dashboard")({
	component: () => <div>Hello /(app)/dashboard!</div>,
});
