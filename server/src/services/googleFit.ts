import SensorReading from "../ts/models/SensorReading";

// Lightweight token store for demo purposes. Replace with your DB/Prisma store.
type GoogleTokens = { accessToken: string; refreshToken?: string };
const userTokenStore = new Map<string, GoogleTokens>();

export function setUserGoogleTokens(userId: string, tokens: GoogleTokens) {
	userTokenStore.set(userId, tokens);
}

function getUserGoogleTokens(userId: string): GoogleTokens | undefined {
	return userTokenStore.get(userId);
}

type AggregateBucket = {
	startTimeMillis: string;
	endTimeMillis: string;
	dataset: Array<{
		dataSourceId?: string;
		point?: Array<{
			value?: Array<{ intVal?: number; fpVal?: number }>;
		}>;
	}>;
};

type AggregateResponse = { bucket?: AggregateBucket[] };

async function callAggregate(accessToken: string, start: Date, end: Date): Promise<AggregateResponse> {
	const body = {
		aggregateBy: [
			{ dataTypeName: "com.google.step_count.delta" },
			{ dataTypeName: "com.google.calories.expended" },
			{ dataTypeName: "com.google.heart_rate.bpm" },
		],
		bucketByTime: { durationMillis: (end.getTime() - start.getTime()) || 24 * 60 * 60 * 1000 },
		startTimeMillis: start.getTime(),
		endTimeMillis: end.getTime(),
	};

	const res = await fetch("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", {
		method: "POST",
		headers: {
			"Authorization": `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Google Fit aggregate error ${res.status}: ${text}`);
	}
	return (await res.json()) as AggregateResponse;
}

function extractValue(bucket: AggregateBucket, dataTypeName: string): number | undefined {
	const stream = bucket.dataset.find((d) => d.dataSourceId?.includes(dataTypeName));
	if (!stream || !stream.point?.length) return undefined;
	const point = stream.point[0];
	const v = point.value?.[0];
	if (!v) return undefined;
	if (v.intVal != null) return v.intVal;
	if (v.fpVal != null) return v.fpVal;
	return undefined;
}

export async function syncGoogleFitData(userId: string) {
	const tokens = getUserGoogleTokens(userId);
	if (!tokens?.accessToken) {
		throw new Error("No Google tokens available for user. Use setUserGoogleTokens(userId, { accessToken, refreshToken }) first.");
	}

	// Time range: today 00:00 to now (local time)
	const now = new Date();
	const start = new Date(now);
	start.setHours(0, 0, 0, 0);

	const result = await callAggregate(tokens.accessToken, start, now);
	const bucket = result.bucket?.[0];
	if (!bucket) return { steps: undefined, calories: undefined, heartRate: undefined };

	const steps = extractValue(bucket, "com.google.step_count.delta");
	const calories = extractValue(bucket, "com.google.calories.expended");
	const heartRate = extractValue(bucket, "com.google.heart_rate.bpm");

	await SensorReading.create({
		athleteId: userId,
		steps: steps || 0,
		calories: calories || 0,
		heartRate: heartRate || 0,
		timestamp: new Date(),
	});

	return { steps, calories, heartRate };
}


