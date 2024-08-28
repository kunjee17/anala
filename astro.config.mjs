import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
	site: "https://anala.netlify.app",
	integrations: [react(), tailwind(), sitemap()],
	output: "server",
	adapter: netlify({
		cacheOnDemandPages: true,
		edgeMiddleware: false, //this is not working giving platform node error
		imageCDN: true,
	}),
	vite: {
		ssr: {
			external: [],
		},
	},
});
