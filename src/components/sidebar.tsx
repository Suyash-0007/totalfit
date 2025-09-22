"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BarChart3, Activity, Stethoscope, Wallet, Briefcase, MessageSquareText } from "lucide-react";

const items = [
	{ href: "/dashboard", label: "Dashboard", icon: BarChart3 },
	{ href: "/performance", label: "Performance", icon: Activity },
	{ href: "/injuries", label: "Injuries", icon: Stethoscope },
	{ href: "/finance", label: "Finance", icon: Wallet },
	{ href: "/career", label: "Career", icon: Briefcase },
	{ href: "/ai-chat", label: "AI Chat", icon: MessageSquareText },
];

export function Sidebar() {
	const pathname = usePathname();
	return (
		<aside className="hidden border-r bg-sidebar md:block md:w-64">
			<div className="flex h-14 items-center px-4 text-sm font-semibold">Navigation</div>
			<nav className="grid gap-1 p-2">
				{items.map(({ href, label, icon: Icon }) => {
					const active = pathname?.startsWith(href);
					return (
						<Link
							key={href}
							href={href}
							className={cn(
								"flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
								active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
							)}
						>
							<Icon className="h-4 w-4" />
							<span>{label}</span>
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}


