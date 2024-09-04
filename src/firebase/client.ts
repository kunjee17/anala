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
	writeBatch,
} from "firebase/firestore";
import type { Post } from "../components";
import { POSTS } from "./fireHelper.ts";

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
export const getAuth = async () => {
	const auth = getAuthFirebase(app);
	/* This will set the persistence to session */
	await auth.setPersistence(browserSessionPersistence);
	return auth;
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
