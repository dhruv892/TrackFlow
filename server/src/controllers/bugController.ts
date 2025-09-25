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
			return res.status(400).json({ msg: "Invalid bug ID" });

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
			return res.status(404).json({ msg: "User not found" });
		}
		console.log(error);
		res.status(500).json({ msg: "Failed to create bug" });
	}
};

type UpdateBugParams = {
	id: string
}

type UpdateBugBody = {
	title: string;
	description?: string;
	status?: BugStatus;
	priority?: PriorityStates;
};

type UpdateNewData = {
	title?: string;
	description?: string;
	status?: BugStatus;
	priority?: PriorityStates;
}

export const updateBug = async (req: Request<UpdateBugParams, any, UpdateBugBody>, res: Response) => {
	try {
		// Step 1: First find the bug
		const bugId = Number(req.params.id);
		if (!Number.isInteger(bugId))
			return res.status(400).json({ msg: "Valid userId is required" });

		const bug = await prisma.bug.findUnique({
			where: { id: bugId }
		})

		if (!bug)
			return res.status(404).json({ msg: `Bug with id ${bugId} does not exist.` })


		// Step 2: Update its fields
		const { title, description, status, priority } = req.body;
		const newData: UpdateNewData = {};

		if (title?.trim())
			newData.title = title;

		if (description?.trim())
			newData.description = description;

		if (status)
			newData.status = status;

		if (priority)
			newData.priority = priority;

		// Step 3: Update the db
		const updatedBug = await prisma.bug.update({
			where: {
				id: bugId
			},
			data: newData
		});

		res.json(updatedBug)
	} catch (error) {
		res.status(500).json({ msg: "Failed to create bug" })
	}
}
