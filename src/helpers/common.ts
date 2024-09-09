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