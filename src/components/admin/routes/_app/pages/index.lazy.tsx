import { useAsync, useMountEffect } from "@react-hookz/web";
import { Link, createLazyFileRoute } from "@tanstack/react-router";
import { Loading } from "react-daisyui";
import { deletePage, fetchPages } from "../../../../../firebase/client.ts";
import { ErrorMsg } from "../../../components";
import { CommonList } from "../../../components/commonList.tsx";

export const Route = createLazyFileRoute("/_app/pages/")({
	component: List,
});

function List() {
	const [state, action] = useAsync(() => fetchPages());

	useMountEffect(action.execute);
	if (state.status === "loading") {
		return <Loading />;
	}

	if (state.status === "error") {
		return <ErrorMsg errorMsg={state.error?.message} />;
	}

	return (
		<CommonList
			addLink={
				<Link to="/pages/add" className="btn btn-ghost normal-case">
					{" "}
					Add{" "}
				</Link>
			}
			reFetch={action.execute}
			deleteItem={deletePage}
			data={state.result?.map((item) => ({
				id: item.id,
				name: item.name,
				content: item.content,
				href: item.href,
				isDelete: !item.isSystem,
				editHref: (
					<Link
						className="btn btn-secondary"
						to="/pages/$id/edit"
						params={{
							id: item.id || "",
						}}
					>
						Edit{" "}
					</Link>
				),
			}))}
		/>
	);
}
