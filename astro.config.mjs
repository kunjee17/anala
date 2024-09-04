import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
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
		plugins: [TanStackRouterVite()],
		build: {
			chunkSizeWarningLimit: 2048, //Its server functions so size doesn't matter much
		},
		ssr: {
			external: [],
		},
	},
});
