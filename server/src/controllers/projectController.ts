import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import {
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
    const userId = req.user?.userId;
    const projects = await prisma.project.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        users: {
          select: { email: true },
        },
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

    const project = await prisma.project.create({
      data: {
        name,
        description,
        users: { connect: { id: req.user?.userId } }, // creator auto-added as user
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

// Add a user to a project by email
export const addUserToProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("req.body:", req.body);
    const projectId = Number(req.params.projectId);
    if (isNaN(projectId)) {
      throw new ValidationError("Project ID must be a valid number.");
    }

    const { email } = req.body;

    if (!email || typeof email !== "string") {
      throw new ValidationError("A valid email is required.");
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        users: {
          select: { email: true },
        },
      },
    });
    if (!project) throw new NotFoundError(`Project ${projectId} not found.`);

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundError(`User with email ${email} not found.`);

    if (project.users.some((u) => u.email === email)) {
      throw new ValidationError("User already part of this project.");
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        users: {
          connect: { id: user.id },
        },
      },
      include: {
        users: {
          select: { email: true },
        },
      },
    });

    res.status(200).json(updatedProject);
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
    const { email } = req.body;

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        users: {
          disconnect: { email: email },
        },
      },
      include: {
        users: {
          select: { email: true },
        },
      },
    });

    res.status(200).json(updatedProject);
  } catch (error) {
    // next(error);
    return next(new InternalServerError("Failed to remove user from project"));
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
    await prisma.project.delete({ where: { id: projectId } });
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    // next(error);
    return next(new InternalServerError("Failed to delete project"));
  }
};
