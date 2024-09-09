import {
	RouterProvider,
	createHashHistory,
	createRouter,
} from "@tanstack/react-router";
import { StrictMode } from "react";
import { AuthProvider, useAuth } from "./providers/auth.tsx";
import { routeTree } from "./routeTree.gen.ts";

const hashHistory = createHashHistory();

// Create a new router instance
const router = createRouter({ routeTree, history: hashHistory });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

function InnerApp() {
	const auth = useAuth();
	return <RouterProvider router={router} context={{ auth }} />;
}

export const Main = () => {
	return (
		<StrictMode>
			<AuthProvider>
				<InnerApp />
			</AuthProvider>
		</StrictMode>
	);
};
