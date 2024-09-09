import { useAsync, useMountEffect } from "@react-hookz/web";
import { Link, createLazyFileRoute } from "@tanstack/react-router";
import { Loading } from "react-daisyui";
import { deletePost, fetchPosts } from "../../../../../firebase/client.ts";
import { ErrorMsg } from "../../../components";
import { CommonList } from "../../../components/commonList.tsx";

export const Route = createLazyFileRoute("/_app/posts/")({
	component: List,
});

function List() {
	const [state, action] = useAsync(() => fetchPosts());

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
				<Link to="/posts/add" className="btn btn-ghost normal-case">
					{" "}
					Add{" "}
				</Link>
			}
			reFetch={action.execute}
			deleteItem={deletePost}
			data={state.result?.map((item) => ({
				id: item.id,
				name: item.title,
				content: item.content,
				href: item.url,
				editHref: (
					<Link
						className="btn btn-secondary"
						to="/posts/$id/edit"
						params={{
							id: item.id || "",
						}}
					>
						{" "}
						Edit{" "}
					</Link>
				),
			}))}
		/>
	);
}
