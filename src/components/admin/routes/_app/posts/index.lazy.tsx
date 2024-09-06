import { useAsync, useMountEffect } from "@react-hookz/web";
import { Link, createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Card, Modal } from "react-daisyui";
import { deletePost, fetchPosts } from "../../../../../firebase/client.ts";
import { deleteById, removeHtmlFromMarkdown } from "../../../../../helpers";
import { ErrorMsg } from "../../../components/errorMsg.tsx";
import type { Post } from "../../../posts";

export const Route = createLazyFileRoute("/_app/posts/")({
	component: List,
});

function List() {
	const [state, action] = useAsync(() => fetchPosts());
	const [errorMsg, setErrorMsg] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedPost, setSelectedPost] = useState<Post | undefined>(undefined);
	useMountEffect(action.execute);
	return (
		<div>
			<Link to="/posts/add" className="btn btn-ghost normal-case">
				{" "}
				Add{" "}
			</Link>
			{errorMsg && <ErrorMsg errorMsg={errorMsg} />}
			{state.result && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{state.result.map((post) => (
						<Card key={post.id} className="shadow-lg">
							<Card.Body>
								<Card.Title>{post.title}</Card.Title>
								<article className="prose lg:prose-xl">
									{removeHtmlFromMarkdown(post.content)}
								</article>
								<div className="flex justify-between mt-4">
									<a
										target={"_blank"}
										href={post.url}
										rel="noopener noreferrer"
									>
										<Button color="primary">View</Button>
									</a>
									<Link
										className="btn btn-secondary"
										to="/posts/$id/edit"
										params={{
											id: post.id || "",
										}}
									>
										{" "}
										Edit{" "}
									</Link>
									<Button
										color={"error"}
										onClick={() => {
											setSelectedPost(post);
											setIsModalOpen(true);
										}}
									>
										Delete
									</Button>
								</div>
							</Card.Body>
						</Card>
					))}
					<Modal open={isModalOpen} responsive={true}>
						<Modal.Header>Confirm Deletion</Modal.Header>
						<Modal.Body>
							Are you sure you want to delete the post "{selectedPost?.title}"?
						</Modal.Body>
						<Modal.Actions>
							<Button
								color="error"
								onClick={async () => {
									const res = await deleteById(selectedPost?.id, deletePost);
									if (res._type === "Failure") {
										setErrorMsg(res.msg || "");
									}
									setIsModalOpen(false);
									setSelectedPost(undefined);
									await action.execute();
								}}
							>
								Delete
							</Button>
							<Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
						</Modal.Actions>
					</Modal>
				</div>
			)}
		</div>
	);
}
