"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

type Milestone = { date: string; label: string; detail?: string };

export default function CareerPage() {
	const [milestones, setMilestones] = useState<Milestone[]>([]);
	const [form, setForm] = useState<Milestone>({ date: "", label: "", detail: "" });

	useEffect(() => {
		const saved = localStorage.getItem("career_milestones");
		if (saved) setMilestones(JSON.parse(saved));
		else
			setMilestones([
				{ date: "2019", label: "Joined Academy", detail: "U18 squad" },
				{ date: "2021", label: "First Team Debut", detail: "League appearance" },
			]);
	}, []);

	useEffect(() => {
		localStorage.setItem("career_milestones", JSON.stringify(milestones));
	}, [milestones]);

	function addMilestone(e: React.FormEvent) {
		e.preventDefault();
		if (!form.date || !form.label) return;
		setMilestones((prev) => [{ ...form }, ...prev]);
		setForm({ date: "", label: "", detail: "" });
	}

	function removeMilestone(index: number) {
		setMilestones((prev) => prev.filter((_, i) => i !== index));
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Career Roadmap</h1>
				<p className="text-muted-foreground">Milestones and next steps</p>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>Timeline</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={addMilestone} className="grid gap-3 sm:grid-cols-4">
							<Input placeholder="Year (e.g., 2025)" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
							<Input placeholder="Label (e.g., Captaincy)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="sm:col-span-2" />
							<Button type="submit" className="sm:col-span-1"><Plus className="mr-2 h-4 w-4" /> Add</Button>
							<Textarea placeholder="Details (optional)" value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} className="sm:col-span-4" rows={2} />
						</form>

						<ol className="relative mt-6 border-s pl-6">
							{milestones.map((m, i) => (
								<li key={`${m.date}-${m.label}-${i}`} className="mb-8 ms-4">
									<div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border bg-background" />
									<div className="flex items-start justify-between gap-3">
										<div>
											<time className="text-xs text-muted-foreground">{m.date}</time>
											<h3 className="text-sm font-medium leading-6">{m.label}</h3>
											{m.detail && <p className="text-sm text-muted-foreground">{m.detail}</p>}
										</div>
										<Button variant="ghost" size="icon" onClick={() => removeMilestone(i)}>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</li>
							))}
						</ol>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-amber-500" /> AI Suggestions</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
							<li>Pair with a senior mentor for leadership development.</li>
							<li>Target international tournament exposure in next 12 months.</li>
							<li>Add media training and contract strategy sessions.</li>
						</ul>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}


