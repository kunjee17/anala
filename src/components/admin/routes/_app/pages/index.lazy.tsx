import { useAsync, useMountEffect } from "@react-hookz/web";
import { Link, createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Card, Modal } from "react-daisyui";
import { deletePage, fetchPages } from "../../../../../firebase/client.ts";
import { deleteById, removeHtmlFromMarkdown } from "../../../../../helpers";
import { ErrorMsg } from "../../../errorMsg.tsx";
import type { AnalaPage } from "../../../pages";

export const Route = createLazyFileRoute("/_app/pages/")({
	component: List,
});

function List() {
	const [state, action] = useAsync(() => fetchPages());
	const [errorMsg, setErrorMsg] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedPage, setSelectedPage] = useState<AnalaPage | undefined>(
		undefined,
	);
	useMountEffect(action.execute);
	return (
		<div>
			<Link to="/pages/add" className="btn btn-ghost normal-case">
				{" "}
				Add{" "}
			</Link>
			{errorMsg && <ErrorMsg errorMsg={errorMsg} />}
			{state.result && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{state.result.map((page) => (
						<Card key={page.id} className="shadow-lg">
							<Card.Body>
								<Card.Title>{page.name}</Card.Title>
								<article className="prose lg:prose-xl">
									{removeHtmlFromMarkdown(page.content)}
								</article>
								<div className="flex justify-between mt-4">
									<a
										target={"_blank"}
										href={page.href}
										rel="noopener noreferrer"
									>
										<Button color="primary">View</Button>
									</a>
									<Link
										className="btn btn-secondary"
										to="/pages/$id/edit"
										params={{
											id: page.id || "",
										}}
									>
										Edit{" "}
									</Link>
									<Button
										color={"error"}
										onClick={() => {
											setSelectedPage(page);
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
							Are you sure you want to delete the page "{selectedPage?.name}"?
						</Modal.Body>
						<Modal.Actions>
							<Button
								color="error"
								onClick={async () => {
									const res = await deleteById(selectedPage?.id, deletePage);
									if (res._type === "Failure") {
										setErrorMsg(res.msg || "");
									}
									setIsModalOpen(false);
									setSelectedPage(undefined);
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
