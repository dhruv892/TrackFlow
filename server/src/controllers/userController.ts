import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import {
	ConflictError,
	CustomError,
	InternalServerError,
	NotFoundError,
	ValidationError,
} from "../errors/CustomError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

type loginUserPayload = {
	email: string,
	password: string
}
export const loginUser = async (req: Request<{}, any, loginUserPayload>, res: Response, next: NextFunction) => {
	try {
		const { email, password } = req.body;
		const user = await prisma.user.findUnique({
			where: {
				email: email.toLowerCase().trim(),
			}
		})

		if (!user)
			throw new NotFoundError("User not found.")

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch)
			throw new ValidationError("Invalid credentials.")

		const token = jwt.sign({ userId: user.id }, String(process.env.JWT_SECRET), { expiresIn: '1d' });
		res.json({ token })

	} catch (error) {
		next(error);
	}
}

type CreateUserBody = {
	email: string;
	name: string;
	password: string
};
export const createUser = async (
	req: Request<{}, any, CreateUserBody>,
	res: Response,
	next: NextFunction
) => {
	try {
		// TODO password has to be hashed/encrypted
		const { email, name, password } = req.body;

		// Validation
		if (!email?.trim()) throw new ValidationError("Email is required.");
		if (!name?.trim()) throw new ValidationError("Name is required.");
		if (!password?.trim()) throw new ValidationError("Password is required.");

		const emailData = email.trim().toLowerCase()
		const duplicate = await prisma.user.findUnique({
			where: {
				email: emailData,
			}
		})

		if (duplicate)
			throw new ConflictError("An account with this email already exists.")

		const hashedPassword = await bcrypt.hash(password.trim(), 10);
		const user = await prisma.user.create({
			data: {
				email: emailData,
				name: name.trim(),
				password: hashedPassword
			},
			omit: {
				password: true
			}
		});

		res.json(user);
	} catch (error: any) {
		console.error(error);

		if (error instanceof CustomError) return next(error);

		return next(new InternalServerError("Failed to create user."))
	}
}

type updateUserParam = {
	userId: string,
}
type updateUserPayload = {
	email?: string,
	name?: string,
	password?: string
}
export const updateUser = async (req: Request<updateUserParam, any, updateUserPayload>, res: Response, next: NextFunction) => {
	try {
		const userId = Number(req.params.userId);
		if (Number.isNaN(userId) || !Number.isInteger(userId)) {
			throw new ValidationError("UserId is invalid.")
		}

		const user = await prisma.user.findUnique({
			where: { id: userId }
		})

		if (!user)
			throw new NotFoundError(`User with id ${userId} not found.`)

		const { email, name, password } = req.body;
		let updateData = Object();

		if (email !== undefined && email.trim().length !== 0) {
			const duplicate = await prisma.user.findUnique({
				where: {
					email: email.toLowerCase().trim()
				}
			})

			if (duplicate)
				throw new ValidationError("An account with this email already exists.")
			updateData.email = email.toLowerCase().trim();
		}

		if (name !== undefined && name.trim().length !== 0) {
			updateData.name = name.trim();
		}

		if (password !== undefined && password.trim().length !== 0) {
			updateData.password = password.trim();
		}

		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: updateData,
			omit: {
				password: true
			}
		})

		res.json(updatedUser)

	} catch (error) {
		return next(error)
	}
}

type getUserInfoParam = {
	userId: string,
}

export const getUserDeletionInfo = async (req: Request<getUserInfoParam, any, {}>, res: Response, next: NextFunction) => {
	try {
		const userId = Number(req.params.userId);
		if (Number.isNaN(userId) || !Number.isInteger(userId)) {
			throw new ValidationError("Invalid userID received.")
		}

		const [bugsCount, commentsCount] = await Promise.all([
			prisma.bug.count({ where: { userId: userId } }),
			prisma.comment.count({ where: { authorId: userId } })
		]);

		res.status(200).json({
			userId,
			bugsCount,
			commentsCount
		});
	} catch (error) {
		next(error);
	}
}


type deleteUserParams = {
	userId: string
}
export const deleteUser = async (req: Request<deleteUserParams, any, {}>, res: Response, next: NextFunction) => {
	try {
		const userId = Number(req.params.userId);
		if (Number.isNaN(userId) || !Number.isInteger(userId))
			throw new ValidationError("Invalid userId received.")

		await prisma.$transaction([
			prisma.comment.deleteMany({
				where: { authorId: userId }
			}),
			prisma.bug.deleteMany({
				where: { userId: userId }
			}),
			prisma.user.delete({
				where: { id: userId }
			})
		]);

		res.status(200).json({
			msg: "User and all the records deleted successfully."
		})
	} catch (error) {
		next(error);
	}
}


export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
	try {
		const users = await prisma.user.findMany({
			include: {
				comments: true,
				bugs: true,
				assignedBugs: true
			},
			omit: {
				password: true
			}
		});
		res.json(users);
	} catch (error) {
		console.error(error);
		return next(new InternalServerError("Failed to fetch users."))
	}
};


type getUserParam = {
	userId: string,
}
export const getUser = async (req: Request<getUserParam, any, {}>, res: Response, next: NextFunction) => {
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
			},
			omit: {
				password: true
			}
		})

		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
}
