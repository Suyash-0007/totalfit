"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { GoogleButton } from "@/components/ui/google-button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
	const { signIn, signInWithGoogle } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [googleLoading, setGoogleLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			await signIn(email, password);
			router.push("/dashboard");
		} catch (err) { // eslint-disable-line @typescript-eslint/no-explicit-any
			setError((err as Error).message || "Failed to sign in");
			setLoading(false);
		}
	}

	async function handleGoogleSignIn() {
		setError("");
		setGoogleLoading(true);
		try {
			await signInWithGoogle();
			router.push("/dashboard");
		} catch (err) { // eslint-disable-line @typescript-eslint/no-explicit-any
			setError((err as Error).message || "Failed to sign in with Google");
			setGoogleLoading(false);
		}
	}

	return (
		<div className="mx-auto max-w-md p-4">
			<Card className="shadow-lg border-2">
				<CardHeader className="pb-2">
					<CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
				</CardHeader>
				<CardContent>
					{error && (
						<div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
							{error}
						</div>
					)}
					
					<GoogleButton 
						onClick={handleGoogleSignIn} 
						loading={googleLoading} 
						className="mb-4"
					/>
					
					<div className="relative my-4">
						<Separator />
						<div className="absolute inset-0 flex items-center justify-center">
							<span className="bg-white px-2 text-muted-foreground text-sm">or continue with email</span>
						</div>
					</div>
					
					<form onSubmit={handleSubmit} className="grid gap-4 mt-4">
						<Input 
							placeholder="Email" 
							type="email" 
							value={email} 
							onChange={(e) => setEmail(e.target.value)} 
							required 
						/>
						<Input 
							placeholder="Password" 
							type="password" 
							value={password} 
							onChange={(e) => setPassword(e.target.value)} 
							required 
						/>
						<Button 
							type="submit" 
							disabled={loading} 
							className="mt-2"
						>
							{loading ? "Loading..." : "Sign In"}
						</Button>
					</form>
					
					<div className="text-center mt-6 text-sm">
						Don&apos;t have an account?{" "}
						<Link href="/signup" className="text-primary font-medium hover:underline">
							Sign up
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}


