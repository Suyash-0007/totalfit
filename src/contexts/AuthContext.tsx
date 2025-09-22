"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export type AppRole = "Athlete" | "Coach" | "Organization";

type AuthContextType = {
	user: User | null;
	role: AppRole | null;
	signIn: (email: string, password: string) => Promise<void>;
	signInWithGoogle: () => Promise<void>;
	signUp: (email: string, password: string, role: AppRole) => Promise<void>;
	logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [role, setRole] = useState<AppRole | null>(null);

	useEffect(() => {
		if (!auth || !db) return;
		const unsub = onAuthStateChanged(auth, async (u) => {
			setUser(u);
			if (u) {
				const ref = doc(db!, "users", u.uid);
				const snap = await getDoc(ref);
				setRole((snap.data()?.role as AppRole) ?? null);
			} else {
				setRole(null);
			}
		});
		return () => {
			if (unsub) unsub();
		};
	}, []);

	async function signIn(email: string, password: string) {
		if (!auth) throw new Error("Auth not initialized");
		await signInWithEmailAndPassword(auth, email, password);
	}

	async function signInWithGoogle() {
		if (!auth || !db) throw new Error("Auth/DB not initialized");
		const provider = new GoogleAuthProvider();
		provider.addScope('https://www.googleapis.com/auth/userinfo.email');
		provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
		
		try {
			const result = await signInWithPopup(auth, provider);
			const user = result.user;
			
			// Check if user exists in Firestore
			const userRef = doc(db, "users", user.uid);
			const userSnap = await getDoc(userRef);
			
			// If user doesn't exist, create a new user document
			if (!userSnap.exists()) {
				await setDoc(userRef, {
					role: "Athlete", // Default role for Google sign-in users
					email: user.email,
					displayName: user.displayName,
					photoURL: user.photoURL,
					createdAt: new Date(),
				});
			}
		} catch (error) {
			console.error("Error signing in with Google:", error);
			throw error;
		}
	}

	async function signUp(email: string, password: string, role: AppRole) {
		if (!auth || !db) throw new Error("Auth/DB not initialized");
		const cred = await createUserWithEmailAndPassword(auth, email, password);
		await setDoc(doc(db, "users", cred.user.uid), { role });
	}

	function logout() {
		if (!auth) throw new Error("Auth not initialized");
		return signOut(auth);
	}

	return (
		<AuthContext.Provider value={{ user, role, signIn, signInWithGoogle, signUp, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}


