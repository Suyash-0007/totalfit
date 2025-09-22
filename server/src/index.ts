import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import mongoose from "mongoose";
import athletesRouter from "./routes/athletes";
import performanceRouter from "./routes/performance";
import injuriesRouter from "./routes/injuries";
import financeRouter from "./routes/finance";
import careerRouter from "./routes/career";
import googleFitRouter from "./routes/googlefit";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Prisma (Postgres) - make optional so server can run without Prisma generated
export let prisma: PrismaClient | null = null;
try {
	prisma = new PrismaClient();
} catch (err) {
	console.warn("Prisma not initialized; continuing without Postgres. Run 'npx prisma generate'.");
}

// Mongoose (MongoDB)
async function connectMongo() {
	const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/totalfit";
	await mongoose.connect(uri);
}

app.get("/api/health", (_req, res) => {
	res.json({ status: "ok" });
});

app.use("/api/athletes", athletesRouter);
app.use("/api/performance", performanceRouter);
app.use("/api/injuries", injuriesRouter);
app.use("/api/finance", financeRouter);
app.use("/api/career", careerRouter);
app.use("/api/googlefit", googleFitRouter);

const port = process.env.PORT || 4000;

async function start() {
	await connectMongo();
	if (prisma) {
		await prisma.$connect().catch((e: Error) => {
			console.warn("Failed to connect Prisma. Continuing without Postgres.", e);
			prisma = null;
		});
	}
	app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
}

start().catch((err) => {
	console.error(err);
	process.exit(1);
});
