import { useAsync, useMountEffect } from "@react-hookz/web";
import {
	type User,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
} from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { getAuth, googleAuthProvider } from "../../../firebase/client.ts";

export type SignInDTO = {
	email: string;
	password: string;
};

type AuthContextProps = {
	currentUser: User | null;
	loading: boolean;
	loginWithGoogle: () => Promise<void>;
	loginWithEmailPassword: (dto: SignInDTO) => Promise<void>;
	logout: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextProps | null>(null);

const isAllowedEmail = async (email: string) => {
	const allowed_email_res = await fetch(
		`/api/auth/allowed-emails?email=${encodeURIComponent(email)}`,
	);
	if (allowed_email_res.status === 404) {
		return false;
	}
	return true;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);

	const [loading, setLoading] = useState(true);
	const [state, actions] = useAsync(getAuth);

	useMountEffect(actions.execute);

	useEffect(() => {
		const unsubscribe = state.result
			? onAuthStateChanged(state.result, (user) => {
					setCurrentUser(user);
					setLoading(false);
				})
			: () => {};
		return () => unsubscribe();
	}, [state.result]);

	const logout = async () => {
		if (state.result) {
			setLoading(true);
			await signOut(state.result);
		}
	};

	const loginWithEmailPassword = async (dto: SignInDTO) => {
		if (state.result) {
			setLoading(true);
			const { email, password } = dto;
			const userCredential = await signInWithEmailAndPassword(
				state.result,
				email,
				password,
			);
			const isValid = await isAllowedEmail(userCredential.user.email || "");
			if (!isValid) {
				await signOut(state.result);
			}
		}
	};

	const loginWithGoogle = async () => {
		if (state.result) {
			setLoading(true);
			const userCredential = await signInWithPopup(
				state.result,
				googleAuthProvider,
			);
			const isValid = await isAllowedEmail(userCredential.user.email || "");
			if (!isValid) {
				await signOut(state.result);
			}
		}
	};

	return (
		<AuthContext.Provider
			value={{
				currentUser,
				loading,
				logout,
				loginWithGoogle,
				loginWithEmailPassword,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
