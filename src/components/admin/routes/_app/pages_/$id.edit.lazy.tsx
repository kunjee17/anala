import { useAsync, useMountEffect } from "@react-hookz/web";
import { createLazyFileRoute } from "@tanstack/react-router";
import { getPageById } from "../../../../../firebase/client.ts";
import { ErrorMsg } from "../../../errorMsg.tsx";
import { AddOrEdit } from "../../../pages";

export const Route = createLazyFileRoute("/_app/pages/$id/edit")({
	component: Edit,
});

function Edit() {
	const { id } = Route.useParams();
	const navigate = Route.useNavigate();
	const [state, actions] = useAsync(() => getPageById(id));
	useMountEffect(actions.execute);
	if (state.status === "success") {
		return (
			<>
				{!state.result && <ErrorMsg errorMsg={`No Page Found for Id ${id}`} />}
				<AddOrEdit
					initialData={state.result}
					successFn={async () => {
						await navigate({
							to: "/pages",
						});
					}}
				/>
			</>
		);
	}

	return <div>Loading</div>;
}
