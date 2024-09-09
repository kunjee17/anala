import { type ReactElement, useState } from "react";
import { Button, Card, Modal } from "react-daisyui";
import { deleteById, removeHtmlFromMarkdown } from "../../../helpers";
import { ErrorMsg } from "./errorMsg";

export type CommonListProps = {
	addLink: ReactElement;

	reFetch: () => Promise<unknown[]>;
	deleteItem: (id: string) => Promise<void>;
	data:
		| {
				id: string | undefined;
				name: string;
				content: string;
				href: string;
				editHref: ReactElement;
		  }[]
		| undefined;
};
export const CommonList = ({
	addLink,
	data,
	reFetch,
	deleteItem,
}: CommonListProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState<
		{ id: string | undefined; name: string } | undefined
	>(undefined);
	const [errorMsg, setErrorMsg] = useState("");
	return (
		<div>
			{addLink}
			{errorMsg && <ErrorMsg errorMsg={errorMsg} />}
			{data && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{data.map((item) => (
						<Card key={item.id} className="shadow-lg">
							<Card.Body>
								<Card.Title>{item.name}</Card.Title>
								<article className="prose lg:prose-xl">
									{removeHtmlFromMarkdown(item.content)}
								</article>
								<div className="flex justify-between mt-4">
									<a
										target={"_blank"}
										href={item.href}
										rel="noopener noreferrer"
									>
										<Button color="primary">View</Button>
									</a>
									{item.editHref}
									<Button
										color={"error"}
										onClick={() => {
											setSelectedItem({
												id: item.id,
												name: item.name,
											});
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
							Are you sure you want to delete the "{selectedItem?.name}"?
						</Modal.Body>
						<Modal.Actions>
							<Button
								color="error"
								onClick={async () => {
									const res = await deleteById(selectedItem?.id, deleteItem);
									if (res._type === "Failure") {
										setErrorMsg(res.msg || "");
									}
									setIsModalOpen(false);
									setSelectedItem(undefined);
									await reFetch();
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
};
