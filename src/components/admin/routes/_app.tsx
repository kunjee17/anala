import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Nav } from "../nav.tsx";

export const Route = createFileRoute("/_app")({
	component: () => (
		<div>
			<Nav />
			<Outlet />
		</div>
	),
});
