import mongoose, { Schema } from "mongoose";

const SensorReadingSchema = new Schema(
	{
		athleteId: { type: String, index: true },
		steps: Number,
		heartRate: Number,
		calories: Number,
		timestamp: { type: Date, default: Date.now, index: true },
	},
	{ collection: "sensor_readings" }
);

const SensorReading = mongoose.models.SensorReading || mongoose.model("SensorReading", SensorReadingSchema);
export default SensorReading;


