import type { AnalaPage } from "../components/admin/pages";

export type ResultType = "Success" | "Failure";

export type Result = {
	_type: ResultType;
	msg?: string;
};

export const deleteById = async (
	id: string | undefined | null,
	deleteFn: (id: string) => Promise<void>,
): Promise<Result> => {
	try {
		if (id) {
			await deleteFn(id);
			return {
				_type: "Success",
				msg: "Deleted successfully",
			};
		}
		return {
			_type: "Failure",
			msg: "No ID to delete",
		};
	} catch (error) {
		return {
			_type: "Failure",
			msg: `Error deleting id ${id}`,
		};
	}
};

export type Tag = {
	name: string;
	count: number;
	slug: string;
};

export const defaultPages: AnalaPage[] = [
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
		isVisible: false,
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
];
