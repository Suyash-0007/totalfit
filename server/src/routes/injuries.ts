import { Router } from "express";
import { prisma } from "../index";

const router = Router();

router.get("/", async (_req, res) => {
	if (!prisma) return res.json([]);
	const items = await prisma.injury.findMany();
	res.json(items);
});

export default router;


