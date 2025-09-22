"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	BarChart,
	Bar,
} from "recharts";
import { GlobalSearch } from "@/components/global-search";
import { LiveBadge } from "@/components/live-badge";
import { AIRecommendations } from "@/components/ai-recommendations";
import { GamificationBadges } from "@/components/gamification-badges";
import { DataEntryForm } from "@/components/data-entry-form";
import { GoogleFitConnect } from "@/components/google-fit-connect";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

type PerformanceData = {
	steps: number;
	heartRate: number;
	calories: number;
	rpe: number;
	workoutType: string;
	duration: number;
	notes: string;
};

type SensorReading = {
	_id: string;
	athleteId: string;
	steps: number;
	heartRate: number;
	calories: number;
	timestamp: string;
};

const performanceData = [
	{ name: "Mon", steps: 9000, hr: 62 },
	{ name: "Tue", steps: 11000, hr: 64 },
	{ name: "Wed", steps: 8000, hr: 60 },
	{ name: "Thu", steps: 12500, hr: 65 },
	{ name: "Fri", steps: 10000, hr: 63 },
	{ name: "Sat", steps: 14000, hr: 66 },
	{ name: "Sun", steps: 7000, hr: 59 },
];

const trainingPlan = [
	{ day: "Mon", workout: "Tempo Run", duration: "45 min" },
	{ day: "Tue", workout: "Strength Training", duration: "60 min" },
	{ day: "Wed", workout: "Recovery Jog", duration: "30 min" },
	{ day: "Thu", workout: "Intervals", duration: "50 min" },
	{ day: "Fri", workout: "Mobility + Core", duration: "40 min" },
	{ day: "Sat", workout: "Long Run", duration: "90 min" },
	{ day: "Sun", workout: "Rest", duration: "-" },
];

const financeData = [
	{ label: "Income", value: 5200 },
	{ label: "Expenses", value: 3100 },
];

export default function DashboardPage() {
	const { user } = useAuth();
	const [sensorData, setSensorData] = useState<SensorReading[]>([]);
	const [userData, setUserData] = useState<PerformanceData | null>(null);
	// Add a key to force refresh of components when needed
	const [refreshKey, setRefreshKey] = useState(0);

	const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

	// Load user data from localStorage (simulating user input)
	useEffect(() => {
		const savedData = localStorage.getItem("userPerformanceData");
		if (savedData) {
			setUserData(JSON.parse(savedData));
		}

		const fetchSensorData = async () => {
			if (!user?.uid) return;
			console.log("Fetching sensor data for user:", user.uid);
			try {
				const response = await axios.get<SensorReading[]>(`${backendBase}/api/performance?userId=${user.uid}`);
				console.log("Fetched sensor data:", response.data);
				setSensorData(response.data);
			} catch (error) {
				console.error("Error fetching sensor data:", error);
			}
		};
		fetchSensorData();
	}, [refreshKey, user?.uid]); // Add user.uid as a dependency as well

	// Transform sensor data for the Recharts LineChart
	const chartData = sensorData.map((s) => ({
		name: new Date(s.timestamp).toLocaleDateString(), // Or format as needed
		steps: s.steps,
		hr: s.heartRate,
	}));

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground">For athletes and coaches</p>
				</div>
				<GlobalSearch />
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="lg:col-span-2">
				<Card className="transition hover:shadow-lg">
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle>Performance Analytics</CardTitle>
							<LiveBadge />
						</div>
					</CardHeader>
					<CardContent className="h-72">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={chartData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis yAxisId="left" />
								<YAxis yAxisId="right" orientation="right" />
								<Tooltip />
								<Line yAxisId="left" type="monotone" dataKey="steps" stroke="#6366f1" strokeWidth={2} dot={false} />
								<Line yAxisId="right" type="monotone" dataKey="hr" stroke="#ec4899" strokeWidth={2} dot={false} />
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
				</motion.div>

				<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
				<Card className="transition hover:shadow-lg">
					<CardHeader>
						<CardTitle>Injury Risk Prediction</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-end gap-4">
							<div className="text-5xl font-bold">12%</div>
							<p className="text-sm text-muted-foreground">Low risk this week. Keep training load consistent.</p>
						</div>
					</CardContent>
				</Card>
				</motion.div>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
				<Card className="transition hover:shadow-lg">
					<CardHeader>
						<CardTitle>Training Plan</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2 text-sm">
							{trainingPlan.map((s) => (
								<li key={s.day} className="flex items-center justify-between rounded-md border p-2">
									<span className="font-medium">{s.day}</span>
									<span className="text-muted-foreground">{s.workout}</span>
									<span className="tabular-nums">{s.duration}</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
				</motion.div>

				<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }} className="lg:col-span-2">
				<Card className="transition hover:shadow-lg">
					<CardHeader>
						<CardTitle>Finance Snapshot</CardTitle>
					</CardHeader>
					<CardContent className="h-72">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={financeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="label" />
								<YAxis />
								<Tooltip />
								<Bar dataKey="value" fill="#22c55e" radius={[6, 6, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
				</motion.div>
			</div>

			{/* Google Fit Integration */}
			<GoogleFitConnect />

			{/* Data Entry Form */}
			<DataEntryForm onDataSaved={() => setRefreshKey(prev => prev + 1)} />

			{/* AI Recommendations and Gamification */}
			<div className="grid gap-6 lg:grid-cols-2">
				<AIRecommendations userData={userData || undefined} />
				<GamificationBadges />
			</div>
		</div>
	);
}


