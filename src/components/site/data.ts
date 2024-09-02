// Mostly dumy data for Site. It should come from firebase config and allowed to be configurable

export type Page = {
	name: string;
	href: string;
	content: string; // markdown
	weight: number;
};

export type SiteConfig = {
	title: string;
	pages: Page[];
};

export const siteConfig: SiteConfig = {
	title: "Anala",
	pages: [
		{
			name: "About",
			href: "/about",
			content: "## About",
			weight: 2,
		},
		{
			name: "Resume",
			href: "/resume",
			content: "## Resume",
			weight: 1,
		},
		// This will always be added to page list with the highest weight so it will come last
		{
			name: "Contact",
			href: "/contact",
			content: "## Contact",
			weight: 30,
		},
	],
};
