import { Router } from "express";
import { prisma } from "../index";

const router = Router();

router.get("/", async (_req, res) => {
	if (!prisma) return res.json([]);
	const milestones = await prisma.careerMilestone.findMany();
	res.json(milestones);
});

export default router;


