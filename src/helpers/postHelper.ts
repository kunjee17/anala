import { format } from "date-fns";
import DOMPurify from "dompurify";
import { marked } from "marked";

export type ShortPost = {
	published_on: Date;
	author: string;
	title: string;
	content: string;
	url: string;
};

export const titleToSlug = (title: string) =>
	title
		.toLowerCase() // Convert to lowercase
		.trim() // Remove leading and trailing whitespace
		.replace(/[^\w\s-]/g, "") // Remove all non-word characters (letters, numbers, underscores)
		.replace(/\s+/g, "-") // Replace spaces with hyphens
		.replace(/--+/g, "-") // Replace multiple hyphens with a single hyphen
		.replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens

export const slugToUrl = (slug: string, date: Date) => {
	return import.meta.env.PUBLIC_SLUG_DATE_FORMAT
		? `/${format(date, import.meta.env.PUBLIC_SLUG_DATE_FORMAT)}/${slug}`
		: `/${slug}`;
};

export const removeHtmlFromMarkdown = (content: string) => {
	const htmlContent = import.meta.env.SSR
		? (marked(`${content.substring(0, 40)}...`) as string)
		: DOMPurify.sanitize(marked(`${content.substring(0, 40)}...`) as string);
	const plainText = htmlContent.replace(/<[^>]+>/g, "");
	return plainText.trim();
};

export const calculateTotalPages = (totalPosts: number, postsPerPage: number) =>
	Math.ceil(totalPosts / postsPerPage);
