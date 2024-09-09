import type { ServiceAccount } from "firebase-admin";
import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { AnalaPage } from "../components/admin/pages";
import type { Post } from "../components/admin/posts";
import { type Tag, defaultPages } from "../helpers";
import { CATEGORIES, PAGES, POSTS, TAGS } from "./fireHelper.ts";

const serviceAccount = {
	type: "service_account",
	project_id: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
	private_key_id: import.meta.env.FIREBASE_PRIVATE_KEY_ID,
	private_key: import.meta.env.FIREBASE_PRIVATE_KEY,
	client_email: import.meta.env.FIREBASE_CLIENT_EMAIL,
	client_id: import.meta.env.FIREBASE_CLIENT_ID,
	auth_uri: import.meta.env.FIREBASE_AUTH_URI,
	token_uri: import.meta.env.FIREBASE_TOKEN_URI,
	auth_provider_x509_cert_url: import.meta.env.FIREBASE_AUTH_CERT_URL,
	client_x509_cert_url: import.meta.env.FIREBASE_CLIENT_CERT_URL,
};

const app = !getApps().length
	? initializeApp({
			credential: cert(serviceAccount as ServiceAccount),
		})
	: getApp();

const firestore = app ? getFirestore(app) : getFirestore();

export type PageOrPost = {
	type: "Page" | "Post";
	data: AnalaPage | Post;
};

export const getPageOrPostBySlug = async (slug: string) => {
	const postsCollection = firestore.collection(POSTS);
	const pagesCollection = firestore.collection(PAGES);

	// Query both collections in parallel
	const [postSnapshot, pageSnapshot] = await Promise.all([
		postsCollection.where("url", "==", `/${slug}`).limit(1).get(),
		pagesCollection.where("href", "==", `/${slug}`).limit(1).get(),
	]);

	// Check if the document exists in posts collection
	if (!postSnapshot.empty) {
		const post = postSnapshot.docs[0]?.data() as Post;
		if (post) {
			return { type: "Post", data: post } as PageOrPost;
		}
	}

	// Check if the document exists in pages collection
	if (!pageSnapshot.empty) {
		const page = pageSnapshot.docs[0]?.data() as AnalaPage;
		if (page) {
			return { type: "Page", data: page } as PageOrPost;
		}
		return null;
	}

	// Return null if neither collection has the document
	return null;
};

export const getPagedPosts = async (pageSize: number, pageNumber: number) => {
	const postsCollection = firestore.collection(POSTS);
	let postsQuery = postsCollection
		.orderBy("createdAt", "desc")
		.limit(Number(pageSize));

	if (pageNumber > 1) {
		const previousPageSnapshot = await postsQuery.get();
		const lastVisiblePost =
			previousPageSnapshot.docs[(pageNumber - 1) * pageSize - 1];
		postsQuery = postsCollection
			.orderBy("createdAt", "desc")
			.startAfter(lastVisiblePost)
			.limit(Number(pageSize));
	}

	const snapshot = await postsQuery.get();
	return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Post);
};

export const getPagedPostsByTag = async (
	tag: string | undefined,
	pageSize: number,
	pageNumber: number,
) => {
	const postsCollection = firestore.collection(POSTS);
	let postsQuery = postsCollection
		.where("tags", "array-contains", tag)
		.orderBy("createdAt", "desc")
		.limit(Number(pageSize));

	if (pageNumber > 1) {
		const previousPageSnapshot = await postsQuery.get();
		const lastVisiblePost =
			previousPageSnapshot.docs[(pageNumber - 1) * pageSize - 1];
		postsQuery = postsCollection
			.where("tags", "array-contains", tag)
			.orderBy("createdAt", "desc")
			.startAfter(lastVisiblePost)
			.limit(Number(pageSize));
	}

	const snapshot = await postsQuery.get();
	return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Post);
};

export const getPagedPostsByCategory = async (
	category: string | undefined,
	pageSize: number,
	pageNumber: number,
) => {
	const postsCollection = firestore.collection(POSTS);
	let postsQuery = postsCollection
		.where("category", "==", category)
		.orderBy("createdAt", "desc")
		.limit(Number(pageSize));

	if (pageNumber > 1) {
		const previousPageSnapshot = await postsQuery.get();
		const lastVisiblePost =
			previousPageSnapshot.docs[(pageNumber - 1) * pageSize - 1];
		postsQuery = postsCollection
			.where("category", "==", category)
			.orderBy("createdAt", "desc")
			.startAfter(lastVisiblePost)
			.limit(Number(pageSize));
	}

	const snapshot = await postsQuery.get();
	return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Post);
};

export const getTags = async () => {
	const snapshot = await firestore.collection(TAGS).get();
	return snapshot.docs.map((doc) => doc.data() as Tag);
};

export const getCategories = async () => {
	const snapshot = await firestore.collection(CATEGORIES).get();
	return snapshot.docs.map((doc) => doc.data() as Tag);
};

export const getPostCount = async () => {
	const snapshot = await firestore.collection(POSTS).get();
	return snapshot.size;
};

export const getTagFromSlug = async (tagSlug: string) => {
	const snapshot = await firestore
		.collection(TAGS)
		.where("slug", "==", tagSlug)
		.get();
	return snapshot.docs[0]?.exists ? (snapshot.docs[0].data() as Tag) : null;
};

export const getCategoryFromSlug = async (categorySlug: string) => {
	const snapshot = await firestore
		.collection(CATEGORIES)
		.where("slug", "==", categorySlug)
		.get();
	return snapshot.docs[0]?.exists ? (snapshot.docs[0].data() as Tag) : null;
};

export const getPostCountByTag = async (tag: string) => {
	const snapshot = await firestore
		.collection(POSTS)
		.where("tags", "array-contains", tag)
		.get();
	return snapshot.size;
};

export const getPostCountByCategory = async (category: string) => {
	const snapshot = await firestore
		.collection(POSTS)
		.where("category", "==", category)
		.get();
	return snapshot.size;
};

export const getPages = async () => {
	const pages = await firestore
		.collection(PAGES)
		.where("isVisible", "==", true)
		.get();
	return pages.docs.map((doc) => {
		return { id: doc.id, ...doc.data() } as AnalaPage;
	});
};

export const insertDefaultPages = async () => {
	const batch = firestore.batch();
	const pageCollection = firestore.collection(PAGES);
	for (const page of defaultPages) {
		const pageDoc = pageCollection.doc();
		batch.set(pageDoc, page);
	}

	await batch.commit();
	console.log("Bulk insert of default pages completed successfully.");
};
