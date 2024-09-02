import { initializeApp } from "firebase/app";
import {
	GoogleAuthProvider,
	browserSessionPersistence,
	getAuth as getAuthFirebase,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
	authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);
export const getAuth = async () => {
	const auth = getAuthFirebase(app);
	/* This will set the persistence to session */
	await auth.setPersistence(browserSessionPersistence);
	return auth;
};
export const googleAuthProvider = new GoogleAuthProvider();
