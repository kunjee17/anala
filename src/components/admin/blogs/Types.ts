export type BlogPost = {
	id?: string; // Optional because Firestore will generate this for new posts
	slug: string;
	title: string;
	content: string;
	author: string;
	createdAt: Date;
	updatedAt?: Date;
};
