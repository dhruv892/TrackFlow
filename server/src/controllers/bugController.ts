import { BugStatus, PriorityStates } from "../../generated/prisma/index.js";
import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import {
  AccessDeniedError,
  CustomError,
  InternalServerError,
  NotFoundError,
  ValidationError,
} from "../errors/CustomError.js";

const isProjectMember = async (projectId: number, userId: number) => {
  const membership = await prisma.projectMembership.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });
  return membership;
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

    // check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project)
      throw new NotFoundError(`Project with id ${projectId} does not exist.`);

    if (!_req.user)
      return res.status(401).json({ message: "Not authenticated" });

    // check if user is member of the project
    const membership = await isProjectMember(projectId, _req.user.userId);

    if (!membership) {
      throw new AccessDeniedError(
        "User is not a member of this project. Access denied."
      );
    }

    const bugs = await prisma.bug.findMany({
      where: {
        projectId: projectId,
      },
      include: {
        author: true,
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

    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    const bug = await prisma.bug.findUnique({
      where: { id: id },
      include: {
        author: {
          select: { name: true, email: true },
        },
        comments: true,
        assignedTo: true,
        project: true,
      },
    });
    if (!bug) throw new NotFoundError(`Bug with id ${id} not found.`);

    const membership = await isProjectMember(bug.projectId, req.user.id);
    if (!membership)
      return res.status(403).json({ error: "Not a project member" });

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

    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });
    const userId = req.user.userId;

    description = description ?? "";
    status = status ?? BugStatus.todo;
    priority = priority ?? PriorityStates.medium;
    const projectId = Number(req.params.projectId);
    if (Number.isNaN(projectId) || !Number.isInteger(projectId)) {
      throw new ValidationError("Project ID must be a valid number.");
    }

    // Validation
    if (!title?.trim()) throw new ValidationError("Title is required.");

    const membership = await isProjectMember(projectId, userId);
    if (!membership) {
      throw new AccessDeniedError(
        "User is not a member of this project. Access denied."
      );
    }

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
        assignedTo: true,
      },
    });
    res.status(201).json(bug);
  } catch (error: any) {
    console.error("Error creating the bug:", error);

    if (error instanceof CustomError) return next(error);
    else {
      return next(new InternalServerError("Failed to create bug"));
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
      include: { project: true, assignedTo: true },
    });

    if (!bug) throw new NotFoundError(`Bug with id ${bugId} does not exist.`);

    // Step 2: Update its fields
    const { title, description, status, priority } = req.body;
    const newData: UpdateBugPayload = {};

    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    const membership = await isProjectMember(bug.projectId, req.user.id);
    if (!membership)
      return res.status(403).json({ error: "Not a project member" });

    //is user assigned to the bug or project admin?
    const isAssigned = bug.assignedTo.some(
      (user) => user.id === req.user?.userId
    );
    if (
      !isAssigned &&
      membership.role !== "ADMIN" &&
      bug.userId !== req.user.userId
    ) {
      throw new AccessDeniedError(
        "Only assigned users, owners or project admins can update the bug."
      );
    }

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
      include: { author: true, assignedTo: true },
    });

    res.status(200).json(updatedBug);
  } catch (error: any) {
    console.error("Update bug error:", error);
    if (error instanceof CustomError) return next(error);
    else {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
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

    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    // Validation
    if (!Number.isInteger(bugId)) throw new ValidationError("Invaid bugId");

    // Check if bug exists
    const existingBug = await prisma.bug.findUnique({
      where: { id: bugId },
      include: { project: true },
    });
    if (!existingBug)
      throw new NotFoundError(`Bug with id ${bugId} not found.`);

    const membership = await isProjectMember(
      existingBug.projectId,
      req.user.userId
    );
    if (!membership)
      return res.status(403).json({ error: "Not a project member" });

    // only project owners or admins can delete bug
    if (membership.role !== "ADMIN" && existingBug.userId !== req.user.userId) {
      throw new AccessDeniedError(
        "Only project admins or bug owners can delete the bug."
      );
    }

    const deletedBug = await prisma.bug.delete({
      where: {
        id: bugId,
      },
    });

    return res.status(200).json({
      data: deletedBug,
      msg: `Bug with id ${bugId} deleted successfully.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
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

    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    const bug = await prisma.bug.findUnique({
      where: { id: bugId },
      include: {
        assignedTo: true,
      },
    });
    if (!bug) throw new NotFoundError(`Bug with id ${bugId} not found.`);

    const membership = await isProjectMember(bug.projectId, req.user.id);
    if (!membership)
      return res.status(403).json({ error: "Not a project member" });

    const userIds = req.body.userIds;
    // Check all assigned users are members of the project
    const members = await prisma.projectMembership.findMany({
      where: { projectId: bug.projectId, userId: { in: userIds } },
    });
    if (members.length !== userIds.length) {
      return res
        .status(400)
        .json({ error: "All assigned users must be project members" });
    }

    // check if users are already assigned
    const alreadyAssignedUserIds = bug.assignedTo?.map((user) => user.id) || [];
    const newUserIds = userIds.filter(
      (id: number) => !alreadyAssignedUserIds.includes(id)
    );
    if (newUserIds.length === 0) {
      return res
        .status(400)
        .json({ error: "All users are already assigned to the bug" });
    }

    const updatedBug = await prisma.bug.update({
      where: { id: bugId },
      data: {
        assignedTo: { set: newUserIds.map((id: number) => ({ id })) },
      },
      include: {
        assignedTo: true,
      },
    });
    res.status(200).json({ message: "Bug assigned", bug: updatedBug });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
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

    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    const bug = await prisma.bug.findUnique({
      where: { id: bugId },
      include: {
        assignedTo: true,
        project: true,
      },
    });

    if (!bug) throw new NotFoundError(`Bug with id ${bugId} not found.`);

    const membership = await isProjectMember(bug.projectId, req.user.id);
    if (!membership)
      return res.status(403).json({ error: "Not a project member" });

    // check if there are assigned users
    if (bug.assignedTo.length === 0) {
      return res
        .status(400)
        .json({ error: "No users are assigned to this bug." });
    }

    // only project admin or owner can remove all assigned users
    if (membership.role !== "ADMIN" && bug.userId !== req.user.userId) {
      throw new AccessDeniedError(
        "Only project admins or bug owners can remove all assigned users."
      );
    }

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

    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    const bug = await prisma.bug.findUnique({
      where: { id: bugId },
      include: {
        assignedTo: true,
        project: true,
      },
    });

    if (!bug) throw new NotFoundError(`Bug with id ${bugId} not found.`);

    const membership = await isProjectMember(bug.projectId, req.user.id);
    if (!membership)
      return res.status(403).json({ error: "Not a project member" });

    // only project admin or owner can remove assigned users
    if (membership.role !== "ADMIN" && bug.userId !== req.user.userId) {
      throw new AccessDeniedError(
        "Only project admins or bug owners can remove assigned users."
      );
    }

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
