import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import {
  AccessDeniedError,
  InternalServerError,
  NotFoundError,
  ValidationError,
} from "../errors/CustomError.js";

// Get all projects for the authenticated user
export const getAllProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });
    const userId = req.user.userId;
    const projects = await prisma.project.findMany({
      where: {
        memberships: { some: { userId: userId } },
      },
      include: {
        memberships: { include: { user: true } },
      },
    });
    res.status(200).json(projects);
  } catch (error) {
    // next(error);
    console.error(error);
    return next(new InternalServerError("Failed to fetch projects."));
  }
};

// Create a new project
export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description } = req.body;
    if (!name)
      return res.status(400).json({ message: "Project name is required" });

    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    const project = await prisma.project.create({
      data: {
        name,
        description,
        // author: { connect: { id: req.user?.userId! } },
        author: { connect: { id: req.user?.userId } },
        memberships: {
          create: {
            userId: req.user.userId,
            role: "ADMIN",
          },
        },
      },
      include: {
        memberships: { include: { user: true } },
      },
    });

    res.status(201).json(project);
  } catch (error) {
    // next(error);
    return next(new InternalServerError("Failed to create project"));
  }
};

// Update project details

type UpdateProjectPayload = {
  name?: string;
  description?: string;
};
export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = Number(req.params.projectId);
    if (isNaN(projectId)) {
      throw new ValidationError("Project ID must be a valid number.");
    }

    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    // only project admin can update project details
    const membership = await prisma.projectMembership.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: req.user.userId,
        },
      },
    });

    if (!membership || membership.role !== "ADMIN") {
      throw new AccessDeniedError(
        "Only project admins can update project details."
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundError(`Project with id ${projectId} does not exist.`);
    }

    const { name, description } = req.body;
    const newData: UpdateProjectPayload = {};

    if (name !== undefined) {
      const trimmedName = name.trim();
      if (!trimmedName) {
        throw new ValidationError("Project name cannot be empty.");
      }
      newData.name = trimmedName;
    }

    if (description !== undefined) {
      newData.description = description.trim();
    }

    if (Object.keys(newData).length === 0) {
      throw new ValidationError("No valid fields to update.");
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: newData,
    });

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Error while updating project:", error);
    return next(new InternalServerError("Failed to update project"));
  }
};

// Delete a project
export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = Number(req.params.projectId);
    if (isNaN(projectId)) {
      throw new ValidationError("Project ID must be a valid number.");
    }

    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    // only project author can delete project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundError(`Project with id ${projectId} does not exist.`);
    }
    if (project.authorId !== req.user.userId) {
      throw new AccessDeniedError(
        "Only the project author can delete the project."
      );
    }

    await prisma.project.delete({ where: { id: projectId } });
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    // next(error);
    return next(new InternalServerError("Failed to delete project"));
  }
};
