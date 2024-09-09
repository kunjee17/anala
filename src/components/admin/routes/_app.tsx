import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loading } from "react-daisyui";
import { Nav } from "../components";
import { useAuth } from "../providers";

export const Route = createFileRoute("/_app")({
	component: App,
});

function App() {
	const { loading, currentUser, logout } = useAuth();
	const navigate = Route.useNavigate();

	useEffect(() => {
		if (!loading) {
			if (!currentUser) {
				navigate({
					to: "/login",
				}).then(() => console.log("force navigation login"));
			}
		}
	}, [loading, currentUser, navigate]);

	if (loading) return <Loading variant="dots" />;

	return currentUser ? (
		<>
			<Nav logout={logout} />
			<Outlet />
		</>
	) : null;
}
