"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Injury = {
	date: string;
	area: string;
	severity: "Low" | "Moderate" | "High";
	note?: string;
};

const historyInitial: Injury[] = [
	{ date: "2024-03-12", area: "Left Ankle", severity: "Low", note: "Grade I sprain" },
	{ date: "2024-07-02", area: "Hamstring", severity: "Moderate", note: "10 days recovery" },
];

export default function InjuriesPage() {
	const [history, setHistory] = useState<Injury[]>(historyInitial);
	const [form, setForm] = useState<Injury>({ date: "", area: "", severity: "Low", note: "" });

	function addInjury(e: React.FormEvent) {
		e.preventDefault();
		if (!form.date || !form.area) return;
		setHistory([{ ...form }, ...history]);
		setForm({ date: "", area: "", severity: "Low", note: "" });
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Injuries</h1>
				<p className="text-muted-foreground">Risk management and recovery tracking</p>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Log Injury</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={addInjury} className="grid gap-3 sm:grid-cols-2">
							<div className="sm:col-span-1">
								<Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
							</div>
							<div className="sm:col-span-1">
								<Input placeholder="Area (e.g., Left Ankle)" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
							</div>
							<div className="sm:col-span-2">
								<Input placeholder="Severity (Low/Moderate/High)" value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value as Injury['severity'] })} />
							</div>
							<div className="sm:col-span-2">
								<Input placeholder="Note (optional)" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
							</div>
							<div className="sm:col-span-2">
								<Button type="submit" className="w-full">Add Injury</Button>
							</div>
						</form>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Injury History</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						{history.map((i, idx) => (
							<div key={idx} className="rounded-md border p-3">
								<div className="flex items-center justify-between">
									<div className="text-sm text-muted-foreground">{i.date}</div>
									<Badge variant="outline">{i.severity}</Badge>
								</div>
								<div className="font-medium">{i.area}</div>
								{i.note && <div className="text-sm text-muted-foreground">{i.note}</div>}
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}


