export type BlogPost = {
	id?: string; // Optional because Firestore will generate this for new posts
	slug: string;
	title: string;
	tags: string[];
	category: string;
	content: string;
	author: string;
	url: string;
	createdAt: Date;
	updatedAt?: Date;
};
