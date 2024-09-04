import { createLazyFileRoute } from "@tanstack/react-router";
import { ThemeSettings } from "../../themeSettings.tsx";

export const Route = createLazyFileRoute("/_app/settings")({
	component: () => (
		<div>
			Settings Page will come here
			<ThemeSettings />
		</div>
	),
});
