import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
	{ id: "1", name: "Alex Rivera", sport: "Football", age: 23 },
	{ id: "2", name: "Mia Chen", sport: "Tennis", age: 21 },
	{ id: "3", name: "Liam O'Connor", sport: "Basketball", age: 24 },
];

export default function AthletesIndexPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Athletes</h1>
				<p className="text-muted-foreground">Select an athlete to view profile</p>
			</div>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{data.map((a) => (
					<Card key={a.id} className="transition hover:shadow-lg">
						<CardHeader>
							<CardTitle className="text-base">{a.name}</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-sm text-muted-foreground">{a.sport} • Age {a.age}</div>
							<div className="pt-3">
								<Link href={`/athletes/${a.id}`} className="text-indigo-600 hover:underline">
									View profile →
								</Link>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}



