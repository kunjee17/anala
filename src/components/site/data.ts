// Mostly dumy data for Site. It should come from firebase config and allowed to be configurable

export type Page = {
	name: string;
	href: string;
	content: string; // markdown
	weight: number;
	isVisible: boolean;
};

export type SiteConfig = {
	sessionDays: number;
	title: string;
	pages: Page[];
	defaultPages: Page[];
};

export const siteConfig: SiteConfig = {
	title: "Anala",
	sessionDays: 5,
	pages: [
		{
			name: "About",
			href: "/about",
			content: "## About",
			weight: 5,
			isVisible: true,
		},
		{
			name: "Resume",
			href: "/resume",
			content: "## Resume",
			weight: 6,
			isVisible: true,
		},
	],
	defaultPages: [
		{
			name: "Home",
			href: "/",
			content: "## Home",
			weight: 1,
			isVisible: true,
		},
		{
			name: "Tags",
			href: "/tags",
			content: "## Tags",
			weight: 3,
			isVisible: true,
		},
		{
			name: "Categories",
			href: "/categories",
			content: "## Categories",
			weight: 4,
			isVisible: true,
		},
		{
			name: "Archives",
			href: "/archives",
			content: "## Archives",
			weight: 2,
			isVisible: true,
		},
		{
			name: "Contact",
			href: "/contact",
			content: "## Contact",
			weight: 30,
			isVisible: true,
		},
	],
};
