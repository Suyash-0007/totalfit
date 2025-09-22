"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ResponsiveContainer,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
} from "recharts";

const heartRate = [
	{ t: "Mon", bpm: 62 },
	{ t: "Tue", bpm: 64 },
	{ t: "Wed", bpm: 61 },
	{ t: "Thu", bpm: 66 },
	{ t: "Fri", bpm: 63 },
	{ t: "Sat", bpm: 65 },
	{ t: "Sun", bpm: 60 },
];

const steps = [
	{ t: "Mon", count: 9000 },
	{ t: "Tue", count: 11000 },
	{ t: "Wed", count: 8000 },
	{ t: "Thu", count: 12500 },
	{ t: "Fri", count: 10000 },
	{ t: "Sat", count: 14000 },
	{ t: "Sun", count: 7000 },
];

const calories = [
	{ t: "Mon", kcal: 2200 },
	{ t: "Tue", kcal: 2400 },
	{ t: "Wed", kcal: 2000 },
	{ t: "Thu", kcal: 2600 },
	{ t: "Fri", kcal: 2300 },
	{ t: "Sat", kcal: 2800 },
	{ t: "Sun", kcal: 1900 },
];

const injuries = [
	{ date: "2024-03-12", title: "Ankle sprain", note: "Grade I, left ankle" },
	{ date: "2024-07-02", title: "Hamstring strain", note: "Returned to play in 10 days" },
];

const milestones = [
	{ title: "Joined Academy", date: "2019" },
	{ title: "First Team Debut", date: "2021" },
	{ title: "National Team Call-up", date: "2023" },
	{ title: "Captaincy", date: "2025" },
];

export default function AthleteProfilePage() {
	return (
		<div className="space-y-8">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">Athlete Profile</h1>
					<p className="text-muted-foreground">Overview and recent metrics</p>
				</div>
				<div className="text-right">
					<div className="text-lg font-medium">Alex Rivera</div>
					<div className="text-sm text-muted-foreground">Age 23 • Football (Midfielder)</div>
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle>Resting Heart Rate</CardTitle>
					</CardHeader>
					<CardContent className="h-56">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={heartRate} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="t" />
								<YAxis />
								<Tooltip />
								<Line type="monotone" dataKey="bpm" stroke="#ef4444" strokeWidth={2} dot={false} />
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Daily Steps</CardTitle>
					</CardHeader>
					<CardContent className="h-56">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={steps} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="t" />
								<YAxis />
								<Tooltip />
								<Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={false} />
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Calories Burned</CardTitle>
					</CardHeader>
					<CardContent className="h-56">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={calories} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="t" />
								<YAxis />
								<Tooltip />
								<Line type="monotone" dataKey="kcal" stroke="#22c55e" strokeWidth={2} dot={false} />
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Injury History</CardTitle>
					</CardHeader>
					<CardContent>
						<ol className="space-y-3">
							{injuries.map((i) => (
								<li key={i.date} className="rounded-lg border p-3 shadow-sm">
									<div className="text-sm text-muted-foreground">{i.date}</div>
									<div className="font-medium">{i.title}</div>
									<div className="text-sm text-muted-foreground">{i.note}</div>
								</li>
							))}
						</ol>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Career Roadmap</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-3 sm:grid-cols-2">
							{milestones.map((m) => (
								<div key={m.title} className="rounded-lg border p-4 shadow-sm">
									<div className="text-sm text-muted-foreground">{m.date}</div>
									<div className="font-medium">{m.title}</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}



