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
	createdAt: Timestamp | ShortTimeStamp;
	updatedAt?: Timestamp | ShortTimeStamp;
};

export type ShortTimeStamp = {
	_seconds: number;
	_nanoseconds: number;
};
