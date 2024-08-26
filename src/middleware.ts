import type { APIContext, MiddlewareNext } from "astro";
import { getUser } from "./firebase/server.ts";

export async function onRequest(context: APIContext, next: MiddlewareNext) {
	const { pathname } = context.url;

	const redirectUrl = `/admin?redirect_to=${encodeURIComponent(pathname)}`;

	if (
		pathname.startsWith("/admin/") &&
		(pathname !== "/admin" || !pathname.startsWith("/admin?redirect_to="))
	) {
		const sessionCookie = context.cookies.get("__session")?.value || "";
		if (!sessionCookie) {
			return new Response(null, {
				status: 302,
				headers: {
					location: redirectUrl,
				},
			});
		}

		const user = await getUser(sessionCookie);
		if (!user) {
			return new Response(null, {
				status: 302,
				headers: {
					location: redirectUrl,
				},
			});
		}
	}

	return next(); // Proceed to the next middleware or handler
}
