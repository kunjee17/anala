import type { Timestamp } from "firebase/firestore";

export type Post = {
	id?: string; // Optional because Firestore will generate this for new posts
	slug: string;
	title: string;
	tags: string[];
	category: string;
	content: string;
	author: string;
	url: string;
	createdAt: Timestamp | ShortTimestamp;
	updatedAt?: Timestamp | ShortTimestamp;
};

export type ShortTimestamp = {
	_seconds: number;
	_nanoseconds: number;
};

export type ShortPost = {
	published_on: Date;
	author: string;
	title: string;
	content: string;
	url: string;
};
