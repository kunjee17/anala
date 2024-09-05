/**
 * Anala Page instead of Page because of conflict between Page in Astro
 */
export type AnalaPage = {
	id?: string;
	name: string;
	href: string;
	content: string; // markdown
	weight: number;
	isVisible: boolean;
	isSystem: boolean;
};
