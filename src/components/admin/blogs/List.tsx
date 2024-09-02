import { useAsync, useMountEffect } from "@react-hookz/web";
import DOMPurify from "dompurify";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { marked } from "marked";
import { useState } from "react";
import { Button, Card, Modal } from "react-daisyui";
import { firestore } from "../../../firebase/client.ts";
import type { BlogPost } from "./Types.ts";

const fetchBlogs = async () => {
	const blogsCollection = collection(firestore, "posts");
	const blogs = await getDocs(blogsCollection);
	return blogs.docs.map((doc) => {
		return { id: doc.id, ...doc.data() } as BlogPost;
	});
};

const confirmDelete = async (id?: string) => {
	try {
		if (id) {
			const blogRef = doc(firestore, "posts", id);
			await deleteDoc(blogRef);
			console.log("Blog deleted successfully");
		} else {
			console.log("No id to delete");
		}
	} catch (error) {
		console.error("Error deleting blog:", error);
	}
};

export const List = () => {
	const [state, action] = useAsync(() => fetchBlogs());
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedBlog, setSelectedBlog] = useState<BlogPost | undefined>(
		undefined,
	);
	useMountEffect(action.execute);
	return (
		<div>
			<a href={"/admin/blogs/add"}>
				<Button>Add</Button>
			</a>
			{state.result && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{state.result.map((blog) => (
						<Card key={blog.id} className="shadow-lg">
							<Card.Body>
								<Card.Title>{blog.title}</Card.Title>
								<article
									className="prose lg:prose-xl"
									// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> I know what I am doing </explanation>
									dangerouslySetInnerHTML={{
										__html: DOMPurify.sanitize(
											marked(`${blog.content.substring(0, 40)}...`) as string,
										),
									}}
								/>
								<div className="flex justify-between mt-4">
									<a
										target={"_blank"}
										href={blog.url}
										rel="noopener noreferrer"
									>
										<Button color="primary">View</Button>
									</a>
									<a href={`/admin/blogs/${blog.id}/edit`}>
										<Button color="secondary">Edit</Button>
									</a>
									<Button
										color={"error"}
										onClick={() => {
											setSelectedBlog(blog);
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
							Are you sure you want to delete the blog post "
							{selectedBlog?.title}"?
						</Modal.Body>
						<Modal.Actions>
							<Button
								color="error"
								onClick={async () => {
									await confirmDelete(selectedBlog?.id);
									setIsModalOpen(false);
									setSelectedBlog(undefined);
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
};
