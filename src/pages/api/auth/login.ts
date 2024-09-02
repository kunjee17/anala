import type { APIRoute } from "astro";
import { siteConfig } from "../../../components/site/data.ts";
import { createSessionCookie, verifyIdToken } from "../../../firebase/server";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
	/* Get token from request headers */
	const idToken = request.headers.get("Authorization")?.split("Bearer ")[1];
	if (!idToken) {
		return new Response("No token found", { status: 401 });
	}

	/* Verify id token */
	try {
		await verifyIdToken(idToken);
	} catch (error) {
		return new Response("Invalid token", { status: 401 });
	}

	/* Create and set session cookie */
	const sessionCookie = await createSessionCookie(
		idToken,
		siteConfig.sessionDays,
	);

	cookies.set("__session", sessionCookie, {
		path: "/",
	});
	const redirectUrl = request.headers.get("x-redirect-to");
	return redirectUrl ? redirect(redirectUrl) : redirect("/admin/dashboard");
};
