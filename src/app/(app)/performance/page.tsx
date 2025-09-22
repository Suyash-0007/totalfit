"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { GoogleFitConnect } from "@/components/google-fit-connect";

const weekly = [
	{ day: "Mon", steps: 9000, hr: 62, calories: 520 },
	{ day: "Tue", steps: 11000, hr: 64, calories: 610 },
	{ day: "Wed", steps: 8000, hr: 60, calories: 480 },
	{ day: "Thu", steps: 12500, hr: 65, calories: 640 },
	{ day: "Fri", steps: 10000, hr: 63, calories: 560 },
	{ day: "Sat", steps: 14000, hr: 66, calories: 720 },
	{ day: "Sun", steps: 7000, hr: 59, calories: 430 },
];

type PerformanceData = {
	steps?: number;
	heartRate?: number;
	calories?: number;
	timestamp: string;
};

export default function PerformancePage() {
	const { user } = useAuth();
	const [metric, setMetric] = useState<"steps" | "heartRate" | "calories">("steps");
	const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (user?.uid) {
			fetchPerformanceData();
		}
	}, [user?.uid]);

  const fetchPerformanceData = async () => {
    try {
      // Use original mock data
      const mockData = [
        { steps: 8500, heartRate: 65, calories: 450, timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
        { steps: 9200, heartRate: 68, calories: 520, timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
        { steps: 7800, heartRate: 62, calories: 380, timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
        { steps: 11000, heartRate: 70, calories: 580, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
        { steps: 9500, heartRate: 66, calories: 490, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        { steps: 12000, heartRate: 72, calories: 620, timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
        { steps: 8800, heartRate: 64, calories: 460, timestamp: new Date().toISOString() },
      ];
      setPerformanceData(mockData);
    } catch (error) {
      console.error("Error fetching performance data:", error);
    } finally {
      setIsLoading(false);
    }
  };

	// Process data for charts
	const chartData = performanceData.map((item, index) => ({
		day: new Date(item.timestamp).toLocaleDateString('en-US', { weekday: 'short' }),
		steps: item.steps || 0,
		heartRate: item.heartRate || 0,
		calories: item.calories || 0,
	}));

	return (
		<div className="space-y-6">
			<div className="flex items-end justify-between gap-3">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">Performance</h1>
					<p className="text-muted-foreground">Training load and performance trends</p>
				</div>
				<div className="w-48">
					<Select value={metric} onValueChange={(v) => setMetric(v as "steps" | "heartRate" | "calories")}>
						<SelectTrigger>
							<SelectValue placeholder="Metric" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="steps">Steps</SelectItem>
							<SelectItem value="heartRate">Heart Rate</SelectItem>
							<SelectItem value="calories">Calories</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Google Fit Integration */}
			<GoogleFitConnect />

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Weekly {metric === "heartRate" ? "Heart Rate" : metric === "calories" ? "Calories" : "Steps"}</CardTitle>
					</CardHeader>
					<CardContent className="h-72">
						{isLoading ? (
							<div className="flex items-center justify-center h-full">
								<div className="text-muted-foreground">Loading performance data...</div>
							</div>
						) : chartData.length > 0 ? (
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={chartData} margin={{ left: -10, right: 10, top: 10 }}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="day" />
									<YAxis />
									<Tooltip />
									<Line type="monotone" dataKey={metric} stroke="#6366f1" strokeWidth={2} dot={false} />
								</LineChart>
							</ResponsiveContainer>
						) : (
							<div className="flex items-center justify-center h-full">
								<div className="text-center text-muted-foreground">
									<p>No performance data available</p>
									<p className="text-sm">Connect Google Fit to sync your data</p>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Workload Distribution</CardTitle>
					</CardHeader>
					<CardContent className="h-72">
						{isLoading ? (
							<div className="flex items-center justify-center h-full">
								<div className="text-muted-foreground">Loading workload data...</div>
							</div>
						) : chartData.length > 0 ? (
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={chartData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="day" />
									<YAxis />
									<Tooltip />
									<Bar dataKey="steps" fill="#22c55e" radius={[6,6,0,0]} />
								</BarChart>
							</ResponsiveContainer>
						) : (
							<div className="flex items-center justify-center h-full">
								<div className="text-center text-muted-foreground">
									<p>No workload data available</p>
									<p className="text-sm">Connect Google Fit to sync your data</p>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}


