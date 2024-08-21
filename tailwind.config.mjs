/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
		"node_modules/daisyui/dist/**/*.js",
		"node_modules/react-daisyui/dist/**/*.js",
	],
	theme: {
		extend: {},
	},
	daisyui: {
		themes: ["light", "dark", "cupcake"],
	},
	plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
