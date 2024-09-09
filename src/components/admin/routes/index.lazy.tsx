import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Alert } from "react-daisyui";
import { useAuth } from "../providers/auth.tsx";

export const Route = createLazyFileRoute("/")({
	component: Index,
});

function Index() {
	const { loading, currentUser } = useAuth();
	const navigate = Route.useNavigate();

	useEffect(() => {
		if (!loading && !currentUser) {
			navigate({
				to: "/login",
			}).then(() => console.log("index login"));
		}
		if (!loading && currentUser) {
			navigate({
				to: "/dashboard",
			}).then(() => console.log("index dashboard"));
		}
	}, [loading, currentUser, navigate]);
	return <Alert status={"info"}>Redirecting...</Alert>;
}
