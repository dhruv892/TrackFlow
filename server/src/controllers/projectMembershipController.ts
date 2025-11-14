import type { Request, Response, NextFunction } from "express";
import {
  InternalServerError,
  NotFoundError,
  ValidationError,
} from "../errors/CustomError.js";
import { prisma } from "../lib/prisma.js";

// Add a user to a project by email
export const addUserToProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // check params and body
    const projectId = Number(req.params.projectId);
    if (isNaN(projectId)) {
      throw new ValidationError("Project ID must be a valid number.");
    }
    const { email, role } = req.body;
    if (!email || typeof email !== "string") {
      throw new ValidationError("A valid email is required.");
    }
    // if (role && role !== "ADMIN" && role !== "MEMBER") {
    //   throw new ValidationError("Role must be either 'ADMIN' or 'MEMBER'.");
    // }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new NotFoundError(`Project ${projectId} not found.`);

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundError(`User with email ${email} not found.`);

    // Check if the requesting user is ADMIN
    const requestingUserId = req.user?.userId;
    if (!requestingUserId) {
      throw new ValidationError("Invalid requesting user.");
    }
    const isAdmin = await prisma.projectMembership.findUnique({
      where: { projectId_userId: { projectId, userId: requestingUserId } },
    });
    if (!isAdmin || isAdmin.role !== "ADMIN") {
      throw new ValidationError(
        "Only project admins can add users to the project."
      );
    }
    // Check if user is already part of the project
    const existingMembership = await prisma.projectMembership.findUnique({
      where: {
        projectId_userId: { projectId, userId: user.id },
      },
    });
    if (existingMembership) {
      throw new ValidationError("User is already part of this project.");
    }

    // Add user to project as MEMBER
    const membership = await prisma.projectMembership.create({
      data: {
        projectId,
        userId: user.id,
        role: role || "MEMBER",
      },
    });

    res.status(201).json({ message: "User added to project", membership });
  } catch (error) {
    // next(error);
    console.error("Error adding user to project:", error);
    return next(new InternalServerError("Failed to add user to project"));
  }
};

// Remove a user from a project by email
export const removeUserFromProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = Number(req.params.projectId);
    if (isNaN(projectId)) {
      throw new ValidationError("Project ID must be a valid number.");
    }

    const { email } = req.body;

    if (!email || typeof email !== "string") {
      throw new ValidationError("A valid email is required.");
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundError(`User with email ${email} not found.`);
    const userId = user.id;

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new NotFoundError(`Project ${projectId} not found.`);

    // Check if user is part of the project
    const membership = await prisma.projectMembership.findUnique({
      where: {
        projectId_userId: { projectId, userId },
      },
    });
    if (!membership) {
      throw new ValidationError("User is not part of this project.");
    }

    const removed = await prisma.projectMembership.delete({
      where: {
        projectId_userId: { projectId, userId },
      },
    });

    res.status(200).json({ message: "User removed from project", removed });
  } catch (error) {
    // next(error);
    return next(new InternalServerError("Failed to remove user from project"));
  }
};

// ------------------- PROMOTE / DEMOTE USER -------------------
export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = Number(req.params.projectId);
    const { email, role } = req.body;

    if (isNaN(projectId)) {
      throw new ValidationError("Project ID must be a valid number.");
    }
    if (!email || typeof email !== "string") {
      throw new ValidationError("A valid email is required.");
    }
    if (!role || (role !== "ADMIN" && role !== "MEMBER")) {
      throw new ValidationError("Role must be either 'ADMIN' or 'MEMBER'.");
    }

    //only admin can promote/demote
    const requestingUserId = req.user?.userId;
    if (!requestingUserId) {
      throw new ValidationError("Invalid requesting user.");
    }
    const isAdmin = await prisma.projectMembership.findUnique({
      where: { projectId_userId: { projectId, userId: requestingUserId } },
    });
    if (!isAdmin || isAdmin.role !== "ADMIN") {
      throw new ValidationError("Only project admins can update user roles.");
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new NotFoundError(`Project ${projectId} not found.`);

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundError(`User with email ${email} not found.`);
    const userId = user.id;

    // Check if membership exists
    const membership = await prisma.projectMembership.findUnique({
      where: {
        projectId_userId: { projectId, userId },
      },
    });
    if (!membership) {
      throw new ValidationError("User is not part of this project.");
    }

    // Update user role
    const updatedMembership = await prisma.projectMembership.update({
      where: {
        projectId_userId: { projectId, userId },
      },
      data: {
        role,
      },
    });

    res
      .status(200)
      .json({ message: "User role updated successfully", updatedMembership });
  } catch (error) {
    // next(error);
    return next(new InternalServerError("Failed to update user role"));
  }
};

// ------------------- GET PROJECT MEMBERS -------------------
export const getProjectMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = Number(req.params.projectId);
    if (isNaN(projectId)) {
      throw new ValidationError("Project ID must be a valid number.");
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new NotFoundError(`Project ${projectId} not found.`);

    // Get project members
    const members = await prisma.projectMembership.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({ members });
  } catch (error) {
    // next(error);
    return next(new InternalServerError("Failed to get project members"));
  }
};
