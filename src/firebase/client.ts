import { initializeApp } from "firebase/app";
import {
	GoogleAuthProvider,
	browserSessionPersistence,
	getAuth as getAuthFirebase,
} from "firebase/auth";
import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	increment,
	limit,
	orderBy,
	query,
	setDoc,
	startAfter,
	writeBatch,
} from "firebase/firestore";
import type { AnalaPage } from "../components/admin/pages";
import type { Post } from "../components/admin/posts";
import { titleToSlug } from "../helpers";
import { CATEGORIES, PAGES, POSTS, TAGS } from "./fireHelper.ts";

const firebaseConfig = {
	apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
	authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);
let authInstance: ReturnType<typeof getAuthFirebase> | null = null;
export const getAuth = async () => {
	if (!authInstance) {
		authInstance = getAuthFirebase(app);
		/* Set persistence once during initialization */
		await authInstance.setPersistence(browserSessionPersistence);
	}
	return authInstance;
};
export const googleAuthProvider = new GoogleAuthProvider();

export const insertOrUpdatePost = async (post: Post) => {
	const batch = writeBatch(firestore);
	const posts = collection(firestore, POSTS);
	const tags = collection(firestore, TAGS);
	const categories = collection(firestore, CATEGORIES);

	const postDoc = post.id ? doc(posts, post.id) : doc(posts);

	// Fetch existing post if updating
	let oldPost: Post | null = null;
	if (post.id) {
		const postSnapshot = await getDoc(postDoc);
		if (postSnapshot.exists()) {
			oldPost = postSnapshot.data() as Post;
		}
	}

	// Update tags
	const oldTags = oldPost ? oldPost.tags : [];
	const newTags = post.tags;

	// Tags to add
	const tagsToAdd = newTags.filter((tag) => !oldTags.includes(tag));
	// Tags to remove (only when editing an existing post)
	const tagsToRemove = oldTags.filter((tag) => !newTags.includes(tag));

	for (const tag of tagsToAdd) {
		const tagDoc = doc(tags, tag);
		const tagSnapshot = await getDoc(tagDoc);
		if (tagSnapshot.exists()) {
			batch.update(tagDoc, { count: increment(1) });
		} else {
			batch.set(tagDoc, { name: tag, count: 1, slug: titleToSlug(tag) });
		}
	}

	for (const tag of tagsToRemove) {
		const tagDoc = doc(tags, tag);
		const tagSnapshot = await getDoc(tagDoc);
		if (tagSnapshot.exists()) {
			batch.update(tagDoc, { count: increment(-1) });
		}
	}

	// Update category (similar logic to tags)
	if (post.category) {
		const oldCategory = oldPost?.category || null;
		const newCategory = post.category;

		if (oldCategory !== newCategory) {
			// Increment the new category
			const categoryDoc = doc(categories, newCategory);
			const categorySnapshot = await getDoc(categoryDoc);
			if (categorySnapshot.exists()) {
				batch.update(categoryDoc, { count: increment(1) });
			} else {
				batch.set(categoryDoc, {
					name: newCategory,
					count: 1,
					slug: titleToSlug(newCategory),
				});
			}

			// Decrement the old category (if it exists)
			if (oldCategory) {
				const oldCategoryDoc = doc(categories, oldCategory);
				const oldCategorySnapshot = await getDoc(oldCategoryDoc);
				if (oldCategorySnapshot.exists()) {
					batch.update(oldCategoryDoc, { count: increment(-1) });
				}
			}
		}
	}

	// Set post data
	batch.set(postDoc, post);

	// Commit the batch
	await batch.commit();
};

export const fetchPosts = async () => {
	const postsCollection = collection(firestore, POSTS);
	const posts = await getDocs(postsCollection);
	return posts.docs.map((doc) => {
		return { id: doc.id, ...doc.data() } as Post;
	});
};

export const deletePost = async (id: string) => {
	const batch = writeBatch(firestore);

	const postRef = doc(firestore, POSTS, id);
	const postSnapshot = await getDoc(postRef);

	if (postSnapshot.exists()) {
		const post = postSnapshot.data();

		// Decrement tags
		for (const tag of post.tags) {
			const tagDoc = doc(firestore, TAGS, tag);
			const tagSnapshot = await getDoc(tagDoc);
			if (tagSnapshot.exists()) {
				const currentTagCount = tagSnapshot.data()?.count || 0;
				if (currentTagCount > 0) {
					batch.update(tagDoc, { count: increment(-1) });
				}
			}
		}

		// Decrement category
		if (post.category) {
			const categoryDoc = doc(firestore, CATEGORIES, post.category);
			const categorySnapshot = await getDoc(categoryDoc);
			if (categorySnapshot.exists()) {
				const currentCategoryCount = categorySnapshot.data()?.count || 0;
				if (currentCategoryCount > 0) {
					batch.update(categoryDoc, { count: increment(-1) });
				}
			}
		}

		// Delete the post
		batch.delete(postRef);

		// Commit the batch
		await batch.commit();
		console.log("Post and related data deleted successfully.");
	} else {
		console.error("Post not found.");
	}
};

export const getPostById = async (id: string) => {
	const postDoc = doc(firestore, POSTS, id);
	const docSnapshot = await getDoc(postDoc);

	if (docSnapshot.exists()) {
		return { id: docSnapshot.id, ...docSnapshot.data() } as Post;
	}
	return null;
};

export const insertOrUpdatePage = async (page: AnalaPage) => {
	const pages = collection(firestore, PAGES);
	const pageDoc = page.id ? doc(pages, page.id) : doc(pages);
	await setDoc(pageDoc, page);
};

export const fetchPages = async () => {
	const pageCollection = collection(firestore, PAGES);
	const pages = await getDocs(pageCollection);
	return pages.docs.map((doc) => {
		return { id: doc.id, ...doc.data() } as AnalaPage;
	});
};

export const deletePage = async (id: string) => {
	const pageRef = doc(firestore, PAGES, id);
	const docSnapshot = await getDoc(pageRef);
	if (docSnapshot.exists() && !(docSnapshot.data() as AnalaPage).isSystem) {
		await deleteDoc(pageRef);
	} else {
		throw new Error(
			"Either id doesn't exist or you are trying to delete system page",
		);
	}
};

export const getPageById = async (id: string) => {
	const pageRef = doc(firestore, PAGES, id);
	const docSnapshot = await getDoc(pageRef);
	if (docSnapshot.exists()) {
		return { id: docSnapshot.id, ...docSnapshot.data() } as AnalaPage;
	}
	return null;
};

export const getPagedPosts = async (pageSize: number, pageNumber: number) => {
	const db = getFirestore();
	const postsCollection = collection(db, "posts");

	let postsQuery = query(
		postsCollection,
		orderBy("createdAt", "desc"),
		limit(pageSize),
	);

	if (pageNumber > 1) {
		const previousPageSnapshot = await getDocs(postsQuery);
		const lastVisiblePost =
			previousPageSnapshot.docs[(pageNumber - 1) * pageSize - 1];
		postsQuery = query(
			postsCollection,
			orderBy("createdAt", "desc"),
			startAfter(lastVisiblePost),
			limit(pageSize),
		);
	}

	const snapshot = await getDocs(postsQuery);
	const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

	return { posts };
};
