import type { APIRoute } from "astro";

export const GET: APIRoute = ({ request }) => {
	console.log(request);

	return new Response("Hello World");
};
