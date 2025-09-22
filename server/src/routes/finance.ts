import { Router } from "express";
import { prisma } from "../index";

const router = Router();

router.get("/", async (_req, res) => {
	if (!prisma) return res.json([]);
	const tx = await prisma.transaction.findMany();
	res.json(tx);
});

export default router;


