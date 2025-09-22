import { Router } from "express";
import SensorReading from "../ts/models/SensorReading";

const router = Router();

router.get("/", async (req, res) => {
	const { userId } = req.query;
	console.log("Backend /api/performance received userId:", userId);
	
	let query = {};
	if (userId) {
		query = { athleteId: userId };
	}
	
	const readings = await SensorReading.find(query).sort({ timestamp: -1 }).limit(100).lean();
	console.log("Backend /api/performance returning readings count:", readings.length);
	res.json(readings);
});

// Accept sync payloads from Next.js API and persist in Mongo
router.post("/sync", async (req, res) => {
	try {
		const { athleteId, steps, heartRate, calories, distance, timestamp } = req.body || {};
		if (!athleteId) {
			return res.status(400).json({ error: "athleteId is required" });
		}
		await SensorReading.create({
			athleteId,
			steps: steps ?? 0,
			heartRate: heartRate ?? 0,
			calories: calories ?? 0,
			timestamp: timestamp ? new Date(timestamp) : new Date(),
		});
		return res.status(201).json({ ok: true });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Failed to persist performance data" });
	}
});

export default router;
