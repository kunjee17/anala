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
	setDoc,
	writeBatch,
} from "firebase/firestore";
import type { AnalaPage } from "../components/admin/pages";
import type { Post } from "../components/admin/posts";
import { PAGES, POSTS } from "./fireHelper.ts";

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
	console.log(post);
	const batch = writeBatch(firestore);
	const posts = collection(firestore, POSTS);
	const postDoc = post.id ? doc(posts, post.id) : doc(posts);
	batch.set(postDoc, post);

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
	const postRef = doc(firestore, POSTS, id);
	await deleteDoc(postRef);
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
