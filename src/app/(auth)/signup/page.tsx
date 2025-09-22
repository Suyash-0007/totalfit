"use client";

import { useState } from "react";
import { useAuth, type AppRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

export default function SignupPage() {
	const { signUp } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState<AppRole>("Athlete");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		await signUp(email, password, role);
		setLoading(false);
		router.push("/dashboard");
	}

	return (
		<div className="mx-auto max-w-md">
			<Card>
				<CardHeader>
					<CardTitle>Sign Up</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="grid gap-4">
						<Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
						<Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
						<div>
							<Select value={role} onValueChange={(v) => setRole(v as AppRole)}>
								<SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
								<SelectContent>
									<SelectItem value="Athlete">Athlete</SelectItem>
									<SelectItem value="Coach">Coach</SelectItem>
									<SelectItem value="Organization">Organization</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Account"}</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}




