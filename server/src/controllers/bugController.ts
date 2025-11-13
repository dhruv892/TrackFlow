import { BugStatus, PriorityStates } from "../../generated/prisma/index.js";
import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import {
  CustomError,
  InternalServerError,
  NotFoundError,
  ValidationError,
} from "../errors/CustomError.js";

const checkIfUserExists = async (id: number | string) => {
  const userId = Number(id);
  if (!Number.isInteger(userId) || Number.isNaN(userId)) {
    throw new ValidationError("UserId must be valid.");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user;
};

type GetAllBugsParams = {
  projectId: string;
};
export const getAllBugs = async (
  _req: Request<GetAllBugsParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = Number(_req.params.projectId);
    if (Number.isNaN(projectId) || !Number.isInteger(projectId)) {
      throw new ValidationError("Project ID must be a valid number.");
    }

    const bugs = await prisma.bug.findMany({
      where: {
        projectId: projectId,
      },
      include: {
        author: {
          select: { name: true },
        },
        // comments: true,
        assignedTo: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(bugs);
  } catch (error) {
    console.error(error);
    return next(new InternalServerError("Failed to fetch bugs."));
  }
};

type BugParams = { bugId: string };
export const getBug = async (
  req: Request<BugParams>,
  res: Response,
  next: any
) => {
  try {
    const id = parseInt(req.params.bugId);
    if (Number.isNaN(id) || !Number.isInteger(id))
      throw new ValidationError("Invalid bugId");

    const bug = await prisma.bug.findUnique({
      where: { id: id },
      include: {
        author: {
          select: { name: true, email: true },
        },
        comments: true,
        assignedTo: true,
      },
    });

    if (!bug) throw new NotFoundError(`Bug with id ${id} not found.`);

    res.status(200).json(bug);
  } catch (error) {
    console.error(error);
    if (error instanceof CustomError) return next(error);
    else return next(new InternalServerError("Failed to create bug"));
  }
};

type CreateBugBody = {
  title: string;
  userId: number;
  description?: string;
  status?: BugStatus;
  priority?: PriorityStates;
  projectId?: number;
};

// Only title and userId are mandatory  Others may and may not be received  We have
// to use default values in case of missing values
type CreateBugParams = {
  projectId: string;
};
export const createBug = async (
  req: Request<CreateBugParams, any, CreateBugBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    let { title, description, status, priority } = req.body;
    const userId = req.user?.userId!;
    console.log(userId, "userId from token");
    description = description ?? "";
    status = status ?? BugStatus.todo;
    priority = priority ?? PriorityStates.medium;
    const projectId = Number(req.params.projectId);
    if (Number.isNaN(projectId) || !Number.isInteger(projectId)) {
      throw new ValidationError("Project ID must be a valid number.");
    }

    // Validation
    if (!title?.trim()) throw new ValidationError("Title is required.");

    const user = await checkIfUserExists(userId);
    if (!user)
      throw new ValidationError(`User with id ${userId} does not exist.`);

    const bugData = {
      title: title.trim(),
      description: description?.trim() || "",
      status: status ?? BugStatus.todo,
      priority: priority ?? PriorityStates.medium,
      author: { connect: { id: userId } },
      project: { connect: { id: projectId } },
    };

    const bug = await prisma.bug.create({
      data: bugData,
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    res.status(201).json(bug);
  } catch (error: any) {
    console.error("Error creating the bug:", error);

    if (error instanceof CustomError) return next(error);
    else {
      if (error.code === "P2025") {
        return next(new NotFoundError("User not found"));
      } else {
        return next(new InternalServerError("Failed to create bug"));
      }
    }
  }
};

type UpdateBugParams = {
  bugId: string;
};

type UpdateBugPayload = {
  title?: string;
  description?: string;
  status?: BugStatus;
  priority?: PriorityStates;
};

export const updateBug = async (
  req: Request<UpdateBugParams, any, UpdateBugPayload>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Step 1: First find the bug
    const bugId = Number(req.params.bugId);
    if (!Number.isInteger(bugId))
      throw new ValidationError("Valid bugId is required.");

    const bug = await prisma.bug.findUnique({
      where: { id: bugId },
    });

    if (!bug) throw new NotFoundError(`Bug with id ${bugId} does not exist.`);

    // Step 2: Update its fields
    const { title, description, status, priority } = req.body;
    const newData: UpdateBugPayload = {};

    // Validation
    if (
      !title &&
      !description &&
      status === undefined &&
      priority === undefined
    )
      throw new ValidationError(
        "At least one field (title, description, status or priority) must be provided for update."
      );

    if (title !== undefined) {
      const trimmedTitle = title.trim();
      if (trimmedTitle.length === 0)
        throw new ValidationError(
          "Title can not be empty or only whitespaces."
        );

      newData.title = trimmedTitle;
    }

    if (description !== undefined) {
      const trimmedDesc = description.trim();
      newData.description = trimmedDesc;
    }

    if (status !== undefined) newData.status = status;

    if (priority !== undefined) newData.priority = priority;

    // Step 3: Update the db
    const updatedBug = await prisma.bug.update({
      where: {
        id: bugId,
      },
      data: newData,
    });

    res.status(200).json(updatedBug);
  } catch (error: any) {
    console.error("Update bug error:", error);
    if (error instanceof CustomError) return next(error);
    else {
      if (error.code === "P2025")
        return next(new NotFoundError("Bug not found during update"));

      return next(new InternalServerError("Failed to update bug"));
    }
  }
};

export const deleteBug = async (
  req: Request<BugParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const bugId = Number(req.params.bugId);

    // Validation
    if (!Number.isInteger(bugId)) throw new ValidationError("Invaid bugId");

    // Check if bug exists
    const existingBug = await prisma.bug.findUnique({
      where: { id: bugId },
    });

    if (!existingBug)
      throw new NotFoundError(`Bug with id ${bugId} not found.`);

    const deletedBug = await prisma.bug.delete({
      where: {
        id: bugId,
      },
    });

    return res.status(200).json({
      data: deletedBug,
      msg: `Bug with id ${bugId} deleted successfully.`,
    });
  } catch (error: any) {
    console.error("Error deleting the bug:", error);

    if (error instanceof CustomError) return next(error);
    else {
      if (error.code === "P2025") {
        return next(
          new NotFoundError(`Bug with id ${req.params.bugId} not found.`)
        );
      }

      return next(new InternalServerError("Failed to delete bug"));
    }
  }
};

// Bug assignment
type AssignUserToBugParams = {
  bugId: string;
};
type AssignUserToBugBody = {
  userIds: number[];
};
export const assignUserToBug = async (
  req: Request<AssignUserToBugParams, any, AssignUserToBugBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const bugId = Number(req.params.bugId);

    if (Number.isNaN(bugId) || !Number.isInteger(bugId))
      throw new ValidationError("Invalid bugId");

    const bug = await prisma.bug.findUnique({
      where: { id: bugId },
    });

    if (!bug) throw new NotFoundError(`Bug with id ${bugId} not found.`);

    const userIds = req.body.userIds;
    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
    });

    if (users.length !== userIds.length) {
      throw new ValidationError("One or more user IDs are invalid");
    }

    const updatedBug = await prisma.bug.update({
      where: { id: bugId },
      data: {
        assignedTo: {
          connect: userIds.map((id) => ({ id: id })),
        },
      },
      include: {
        assignedTo: true,
      },
    });

    res.status(200).json(updatedBug);
  } catch (error) {
    next(error);
  }
};

type RemoveAssignedParams = {
  bugId: string;
};
export const removeAllAssignedUsers = async (
  req: Request<RemoveAssignedParams, any, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const bugId = Number(req.params.bugId);

    if (Number.isNaN(bugId) || !Number.isInteger(bugId))
      throw new ValidationError("Invalid bugId received.");

    const updatedBug = await prisma.bug.update({
      where: { id: bugId },
      data: {
        assignedTo: {
          set: [],
        },
      },
      include: {
        assignedTo: true,
      },
    });

    res.status(200).json(updatedBug);
  } catch (error) {
    next(error);
  }
};

type removeAssignedUsersBody = {
  userIds: number[];
};
export const removeAssignedUsers = async (
  req: Request<RemoveAssignedParams, any, removeAssignedUsersBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const bugId = Number(req.params.bugId);
    if (Number.isNaN(bugId) || !Number.isInteger(bugId))
      throw new ValidationError(`Invalid bug id received.`);

    const userIds = req.body.userIds;
    if (userIds === undefined || userIds.length === 0)
      throw new ValidationError("UserIds are required.");

    const bug = await prisma.bug.findUnique({
      where: { id: bugId },
      include: {
        assignedTo: true,
      },
    });

    if (!bug) throw new NotFoundError(`Bug with id ${bugId} not found.`);

    const newUsers = bug.assignedTo.filter(
      (user) => !userIds.includes(user.id)
    );

    const updatedBug = await prisma.bug.update({
      where: { id: bugId },
      data: {
        assignedTo: {
          set: newUsers,
        },
      },
      include: {
        assignedTo: true,
      },
    });

    res.status(200).json(updatedBug);
  } catch (error) {
    next(error);
  }
};
