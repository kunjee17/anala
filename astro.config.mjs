import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://example.com",
	integrations: [react(), tailwind()],
	output: "server",
	adapter: netlify(),
});
