import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import {
	ConflictError,
	CustomError,
	InternalServerError,
	ValidationError,
} from "../errors/CustomError.js";

type CreateUserBody = {
	email: string;
	name: string;
};
export const createUser = async (
	req: Request<{}, any, CreateUserBody>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email, name } = req.body;

		// Validation
		if (!email?.trim()) throw new ValidationError("Email is required.");
		if (!name?.trim()) throw new ValidationError("Name is required.");

		const user = await prisma.user.create({
			data: {
				email: email.toLowerCase().trim(),
				name: name.trim(),
			},
		});

		res.json(user);
	} catch (error: any) {
		console.error(error);

		if (error instanceof CustomError) return next(error);
		if (error?.code === "P2002")
			return next(new ConflictError("Email already exists."));

		return next(new InternalServerError("Failed to create user."))
	}
}

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
	try {
		const users = await prisma.user.findMany({
			include: {
				comments: true,
				bugs: true,
				assignedBugs: true
			}
		});
		res.json(users);
	} catch (error) {
		console.error(error);
		return next(new InternalServerError("Failed to fetch users."))
	}
};


type getUserParma = {
	userId: string,
}
export const getUser = async (req: Request<getUserParma, any, {}>, res: Response, next: NextFunction) => {
	try {
		const userId = Number(req.params.userId);
		if (Number.isNaN(userId) || !Number.isInteger(userId)) {
			throw new ValidationError("Invalid userID received.")
		}

		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: {
				comments: true,
				bugs: true,
				assignedBugs: true
			}
		})

		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
}
