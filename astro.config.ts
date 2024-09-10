import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { defineConfig } from "astro/config";
import dotenv from "dotenv";

import robotsTxt from "astro-robots-txt";

import partytown from "@astrojs/partytown";

//Loading .env file
dotenv.config();

// https://astro.build/config
export default defineConfig({
	site: process.env.PUBLIC_SITE || "",
	integrations: [react(), tailwind(), sitemap(), robotsTxt(), partytown()],
	output: "server",
	adapter: netlify({
		cacheOnDemandPages: true,
		edgeMiddleware: false, //this is not working giving platform node error
		imageCDN: true,
	}),
	vite: {
		plugins: [TanStackRouterVite()],
		build: {
			chunkSizeWarningLimit: 3072, //Its server functions so size doesn't matter much
		},
		ssr: {
			external: [],
		},
	},
});
