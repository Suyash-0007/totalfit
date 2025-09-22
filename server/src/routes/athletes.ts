import { Router } from "express";
import { prisma } from "../index";

const router = Router();

router.get("/", async (_req, res) => {
	if (!prisma) return res.json([]);
	const athletes = await prisma.athleteProfile.findMany();
	res.json(athletes);
});

router.post("/", async (req, res) => {
	if (!prisma) return res.status(503).json({ error: "Prisma unavailable" });
	const created = await prisma.athleteProfile.create({ data: req.body });
	res.status(201).json(created);
});

export default router;


