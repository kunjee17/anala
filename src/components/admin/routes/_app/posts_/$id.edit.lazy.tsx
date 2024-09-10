import { useAsync, useMountEffect } from "@react-hookz/web";
import { createLazyFileRoute } from "@tanstack/react-router";
import { getPostById } from "../../../../../firebase/client.ts";
import { ErrorMsg } from "../../../components";
import { AddOrEdit } from "../../../posts";

export const Route = createLazyFileRoute("/_app/posts/$id/edit")({
	component: Edit,
});

function Edit() {
	const { id } = Route.useParams();
	const navigate = Route.useNavigate();
	const [state, actions] = useAsync(() => getPostById(id));
	useMountEffect(actions.execute);

	if (state.status === "success") {
		return (
			<>
				{!state.result && <ErrorMsg errorMsg={`No Post Found for Id ${id}`} />}
				<AddOrEdit
					initialData={state.result}
					successFn={async () => {
						await navigate({
							to: "/posts",
						});
					}}
				/>
			</>
		);
	}

	return <span className="loading loading-spinner loading-lg" />;
}
