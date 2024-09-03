// Mostly dummy data for Site. It should come from firebase config and allowed to be configurable

import { type ShortPost, calculateTotalPages } from "../../helpers";

export type Page = {
	name: string;
	href: string;
	content: string; // markdown
	weight: number;
	isVisible: boolean;
};

export type SiteConfig = {
	pages: Page[];
	defaultPages: Page[];
};

export const siteConfig: SiteConfig = {
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
	//Get Count form FireStore data
	return calculateTotalPages(
		dummyPosts.length,
		import.meta.env.PUBLIC_SITE_POST_PER_PAGE,
	);
};
