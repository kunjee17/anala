import {
	RouterProvider,
	createHashHistory,
	createRouter,
} from "@tanstack/react-router";
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

export const Main = () => {
	return (
		<>
			This is main from React
			<RouterProvider router={router} />{" "}
		</>
	);
};
