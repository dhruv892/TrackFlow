import {
	BugStatus,
	PriorityStates,
} from "../../generated/prisma/index.js";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export const getAllBugs = async (_req: Request, res: Response) => {
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
		console.log(e)
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
	userId: string;
	description?: string;
	status?: BugStatus;
	priority?: PriorityStates;
};

// Only title and userId are mandatory  Others may and may not be received  We have 
// to use default values in case of missing values
export const createBug = async (
	req: Request<{}, any, CreateBugBody>,
	res: Response
) => {
	try {
		let { title, description, status, priority, userId } = req.body;
		description = description ?? "";
		status = status ?? BugStatus.todo;
		priority = priority ?? PriorityStates.medium;

		// Validation
		if (!title?.trim())
			return res.status(400).json({ msg: "Title is required" });

		if (!userId?.trim()) {
			return res.status(400).json({ msg: "UserId is required" });
		}

		const userIdNum = Number(userId);
		if (!Number.isInteger(userIdNum))
			return res.status(400).json({ msg: "Valid userId is required" });

		const bugData = {
			title: title.trim(),
			description: description?.trim() || "",
			status: status ?? BugStatus.todo,
			priority: priority ?? PriorityStates.medium,
			author: { connect: { id: userIdNum } }
		}

		const bug = await prisma.bug.create({
			data: bugData
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
