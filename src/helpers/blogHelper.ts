import { format } from "date-fns";

export const titleToSlug = (title: string) =>
	title
		.toLowerCase() // Convert to lowercase
		.trim() // Remove leading and trailing whitespace
		.replace(/[^\w\s-]/g, "") // Remove all non-word characters (letters, numbers, underscores)
		.replace(/\s+/g, "-") // Replace spaces with hyphens
		.replace(/--+/g, "-") // Replace multiple hyphens with a single hyphen
		.replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens

export const slugToUrl = (slug: string, date: Date) =>
	`/${format(date, "yyyy/MM")}/${slug}/`;
