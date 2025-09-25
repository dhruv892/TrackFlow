import {
	BugStatus,
	PriorityStates,
	PrismaClient,
} from "../../generated/prisma/index.js";
import type { Request, Response } from "express";

const prisma = new PrismaClient();

export const getAllBugs = async (req: Request, res: Response) => {
	try {
		const bugs = await prisma.bug.findMany({
			include: {
				author: {
					select: { name: true },
				},
			},
			orderBy: { createdAt: "desc" },
		});
		res.status(200).json(bugs);
	} catch (e) {
		res.status(500).json({ msg: "Failed to fetch bugs" });
	}
};

type BugParams = { id: string }; // params for routes like /bugs/:id
export const getBug = async (req: Request<BugParams>, res: Response) => {
	try {
		const id = parseInt(req.params.id);
		if (!Number.isInteger(id))
			return res.status(400).json({ error: "Invalid bug ID" });

		const bug = await prisma.bug.findUnique({
			where: { id },
			include: {
				author: {
					select: { name: true },
				},
			},
		});

		if (!bug)
			return res.status(404).json({ msg: `Bug with id ${id} not found` });

		res.status(200).json(bug);
	} catch (e) {
		res.status(500).json({ msg: "Failed to fetch bug" });
	}
};

type CreateBugBody = {
	title: string;
	description?: string;
	status: BugStatus;
	priority: PriorityStates;
	userId: number | string;
};

export const createBug = async (
	req: Request<{}, any, CreateBugBody>,
	res: Response
) => {
	try {
		const { title, description, status, priority, userId } = req.body;
		const userIdNum = Number(userId);

		// Validation
		if (!title?.trim())
			return res.status(400).json({ msg: "Title is required" });
		if (!Number.isInteger(userIdNum))
			return res.status(400).json({ msg: "Valid userId is required" });

		const bug = await prisma.bug.create({
			data: {
				title: title.trim(),
				description: description?.trim() || null,
				status,
				priority,
				author: {
					connect: { id: userIdNum },
				},
			},
		});
		res.status(201).json(bug);
	} catch (error: any) {
		if (error.code === "P2025") {
			return res.status(404).json({ error: "User not found" });
		}
		console.log(error);
		res.status(500).json({ error: "Failed to create bug" });
	}
};
