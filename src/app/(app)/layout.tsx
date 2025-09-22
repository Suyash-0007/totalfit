"use client";

import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { ProtectedRoute } from "@/components/protected-route";

export default function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ProtectedRoute>
			<div className="flex min-h-screen flex-col">
				<Navbar />
				<div className="flex flex-1">
					<Sidebar />
					<main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
				</div>
			</div>
		</ProtectedRoute>
	);
}




