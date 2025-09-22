"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
	const { user, logout } = useAuth();
	
	return (
		<header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
				<Link href="/" className="flex items-center gap-2 font-semibold">
					<span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">TotalFit</span>
				</Link>
				<nav className="hidden items-center gap-6 text-sm font-medium md:flex">
					<Link href="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link>
					<Link href="/performance" className="text-muted-foreground hover:text-foreground">Performance</Link>
					<Link href="/injuries" className="text-muted-foreground hover:text-foreground">Injuries</Link>
					<Link href="/finance" className="text-muted-foreground hover:text-foreground">Finance</Link>
					<Link href="/career" className="text-muted-foreground hover:text-foreground">Career</Link>
				</nav>
				<div className="flex items-center gap-2">
					<ThemeToggle />
					{user ? (
						<>
							<span className="text-sm text-muted-foreground">{user.email}</span>
							<Button variant="ghost" onClick={logout}>
								Logout
							</Button>
						</>
					) : (
						<>
							<Button asChild variant="ghost">
								<Link href="/login">Login</Link>
							</Button>
							<Button asChild>
								<Link href="/signup">Get Started</Link>
							</Button>
						</>
					)}
					<Sheet>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" className="md:hidden">
								<Menu className="h-5 w-5" />
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-72">
							<nav className="mt-8 grid gap-3 text-sm font-medium">
								<Link href="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link>
								<Link href="/performance" className="text-muted-foreground hover:text-foreground">Performance</Link>
								<Link href="/injuries" className="text-muted-foreground hover:text-foreground">Injuries</Link>
								<Link href="/finance" className="text-muted-foreground hover:text-foreground">Finance</Link>
								<Link href="/career" className="text-muted-foreground hover:text-foreground">Career</Link>
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}


