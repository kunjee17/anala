import type { APIRoute } from "astro";

export const GET: APIRoute = ({ request }) => {
	const url = new URL(request.url);
	const email = url.searchParams.get("email") || "";
	const allowedEmails = import.meta.env.ALLOWED_EMAILS.split(",").map((x) =>
		x.trim(),
	);

	return new Response(null, {
		status: allowedEmails.includes(email) ? 200 : 404,
	});
};
