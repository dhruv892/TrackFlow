import {
	BugStatus,
	PriorityStates,
} from "../../generated/prisma/index.js";
import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { CustomError } from "../errors/CustomError.js";

export const getAllBugs = async (_req: Request, res: Response, next: NextFunction) => {
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
	} catch (error) {
		console.error(error)
		next(new CustomError(500, "Failed to fetch bugs", "InternalServerError"));
	}
};

type BugParams = { id: string };
export const getBug = async (req: Request<BugParams>, res: Response, next: any) => {
	try {
		const id = parseInt(req.params.id);

		if (Number.isNaN(id) || !Number.isInteger(id))
			throw new CustomError(400, "Invalid bugId", "ValidationError");

		const bug = await prisma.bug.findUnique({
			where: { id },
			include: {
				author: {
					select: { name: true },
				},
			},
		});

		if (!bug)
			throw new CustomError(404, `Bug with id ${id} not found.`, "NotFoundError");

		res.status(200).json(bug);
	} catch (error) {
		console.error(error)
		if (error instanceof CustomError)
			next(error)
		else
			next(new CustomError(500, "Failed to create bug", "InternalServerError"));
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
	res: Response,
	next: NextFunction
) => {
	try {
		let { title, description, status, priority, userId } = req.body;
		description = description ?? "";
		status = status ?? BugStatus.todo;
		priority = priority ?? PriorityStates.medium;

		// Validation
		if (!title?.trim())
			throw new CustomError(400, "Title is required.", "ValidationError")

		if (!userId?.trim()) {
			throw new CustomError(400, "UserId is required.", "ValidationError")
		}

		const userIdNum = Number(userId);
		if (!Number.isInteger(userIdNum))
			throw new CustomError(400, "Valid UserId is required.", "ValidationError")


		// TODO: Check if user exists

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
		console.error("Error creating the bug:", error);

		if (error instanceof CustomError)
			next(error)
		else {
			if (error.code === "P2025") {
				next(new CustomError(404, "User not found", "NotFoundError"));
			}
			next(new CustomError(500, "Failed to create bug", "InternalServerError"));
		}
	}
};

type UpdateBugParams = {
	id: string
}

type UpdateBugPayload = {
	title?: string;
	description?: string;
	status?: BugStatus;
	priority?: PriorityStates;
};

export const updateBug = async (req: Request<UpdateBugParams, any, UpdateBugPayload>, res: Response, next: NextFunction) => {
	try {
		// Step 1: First find the bug
		const bugId = Number(req.params.id);
		if (!Number.isInteger(bugId))
			throw new CustomError(400, "Valid bugId is required.", "ValidationError")

		const bug = await prisma.bug.findUnique({
			where: { id: bugId }
		})

		if (!bug)
			throw new CustomError(404, `Bug with id ${bugId} does not exist.`, "NotFoundError");


		// Step 2: Update its fields
		const { title, description, status, priority } = req.body;
		const newData: UpdateBugPayload = {};

		// Validation
		if (!title && !description && status === undefined && priority === undefined)
			throw new CustomError(400, "At least one field (title, description, status or priority) must be provided for update.", "ValidationError");

		if (title !== undefined) {
			const trimmedTitle = title.trim();
			if (trimmedTitle.length === 0)
				throw new CustomError(400, "Title can not be empty or only whitespaces.", "ValidationError")

			newData.title = trimmedTitle;
		}

		if (description !== undefined) {
			const trimmedDesc = description.trim();
			newData.description = trimmedDesc;
		}

		if (status !== undefined)
			newData.status = status;

		if (priority !== undefined)
			newData.priority = priority;

		// Step 3: Update the db
		const updatedBug = await prisma.bug.update({
			where: {
				id: bugId
			},
			data: newData
		});

		res.json(updatedBug)
	} catch (error: any) {
		console.error('Update bug error:', error);
		if (error instanceof CustomError)
			next(error)
		else {
			if (error.code === 'P2025')
				next(new CustomError(404, "Bug not found during update", "InternalServerError"))

			next(new CustomError(500, "Failed to update bug", "InternalServerError"))
		}
	}
}

export const deleteBug = async (req: Request<BugParams>, res: Response, next: NextFunction) => {
	try {
		const bugId = Number(req.params.id);

		// Validation
		if (!Number.isInteger(bugId))
			throw new CustomError(400, "Invaid bugId", "ValidationError")

		// Check if bug exists
		const existingBug = await prisma.bug.findUnique({
			where: { id: bugId }
		});

		if (!existingBug)
			throw new CustomError(404, `Bug with id ${bugId} not found.`, "NotFoundError")

		const deletedBug = await prisma.bug.delete({
			where: {
				id: bugId
			}
		})

		return res.status(200).json({
			data: deletedBug,
			msg: `Bug with id ${bugId} deleted successfully.`
		})
	} catch (error: any) {
		console.error("Error deleting the bug:", error);

		if (error instanceof CustomError)
			next(error)
		else {
			if (error.code === 'P2025') {
				next(new CustomError(404, `Bug with id ${req.params.id} not found.`, "NotFoundError"))
			}

			next(new CustomError(500, "Failed to delete bug", "InternalServerError"))
		}
	}
}
