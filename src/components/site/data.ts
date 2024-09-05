// Mostly dummy data for Site. It should come from firebase config and allowed to be configurable

import { calculateTotalPages } from "../../helpers";
import type { ShortPost } from "../admin";
import type { AnalaPage } from "../admin/pages";

export type SiteConfig = {
	pages: AnalaPage[];
};

export const siteConfig: SiteConfig = {
	pages: [
		...[
			{
				name: "About",
				href: "/about",
				content: "## About",
				weight: 5,
				isVisible: true,
				isSystem: false,
			},
			{
				name: "Resume",
				href: "/resume",
				content: "## Resume",
				weight: 6,
				isVisible: true,
				isSystem: false,
			},
		],

		...[
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
	],
};

export const dummyPosts: ShortPost[] = [
	{
		title: "Some Dumb Title",
		published_on: new Date("2023-12-17"),
		author: "Kunjan",
		url: "2023/12/some-dumb-title",
		content: "## Hi time to trim down markdown",
	},
	{
		title: "Some Dumb Title 2",
		published_on: new Date("2023-11-17"),
		author: "Kunjan",
		url: "2023/11/some-dumb-title-2",
		content: "## Hi time to trim down markdown again",
	},
];

export const pageSize = () => {
	//TODO: Get Count form FireStore data
	return calculateTotalPages(
		dummyPosts.length,
		import.meta.env.PUBLIC_SITE_POST_PER_PAGE,
	);
};
