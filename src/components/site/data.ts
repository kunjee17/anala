// Mostly dummy data for Site. It should come from firebase config and allowed to be configurable

import type { AnalaPage } from "../admin/pages";

export type SiteConfig = {
	pages: AnalaPage[];
};

export const siteConfig: SiteConfig = {
	pages: [
		{
			name: "Home",
			href: "/",
			content: "## Home",
			weight: 1,
			isVisible: true,
			isSystem: true,
		},
		{
			name: "Tags",
			href: "/tags",
			content: "## Tags",
			weight: 3,
			isVisible: true,
			isSystem: true,
		},
		{
			name: "Categories",
			href: "/categories",
			content: "## Categories",
			weight: 4,
			isVisible: true,
			isSystem: true,
		},
		{
			name: "Archives",
			href: "/archives",
			content: "## Archives",
			weight: 2,
			isVisible: true,
			isSystem: true,
		},
		{
			name: "Contact",
			href: "/contact",
			content: "## Contact",
			weight: 30,
			isVisible: true,
			isSystem: true,
		},
	],
};
