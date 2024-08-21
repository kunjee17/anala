import { initializeApp } from "firebase/app";

const firebaseConfig = {
	apiKey: "AIzaSyDXx0O7lVGdxkHXvXElCgU_rkxEK1kgQuY",
	authDomain: "anala-blog.firebaseapp.com",
	projectId: "anala-blog",
	storageBucket: "anala-blog.appspot.com",
	messagingSenderId: "976901010956",
	appId: "1:976901010956:web:2be818421fbb2a1313a029",
};

export const app = initializeApp(firebaseConfig);
