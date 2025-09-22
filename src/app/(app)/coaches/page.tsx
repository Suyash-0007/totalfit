import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const coaches = [
	{ id: "c1", name: "Coach Elena", specialty: "Strength & Conditioning" },
	{ id: "c2", name: "Coach Marcus", specialty: "Endurance" },
	{ id: "c3", name: "Coach Priya", specialty: "Injury Prevention" },
];

export default function CoachesIndexPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Coaches</h1>
				<p className="text-muted-foreground">Team and specialties</p>
			</div>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{coaches.map((c) => (
					<Card key={c.id}>
						<CardHeader>
							<CardTitle className="text-base">{c.name}</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-sm text-muted-foreground">{c.specialty}</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}



