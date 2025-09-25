import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

type CreateUserBody = {
	email: string;
	name: string;
};
export const createUser = async (
	req: Request<{}, any, CreateUserBody>,
	res: Response
) => {
	try {
		const { email, name } = req.body;

		// Validation
		if (!email?.trim())
			return res.status(400).json({ error: "Email is required" });
		if (!name?.trim())
			return res.status(400).json({ error: "Name is required" });

		const user = await prisma.user.create({
			data: {
				email: email.toLowerCase().trim(),
				name: name.trim(),
			},
		});

		res.json(user);
	} catch (error: any) {
		if (error?.code === "P2002") {
			return res.status(409).json({ error: "Email already exists" });
		}
		return res.status(500).json({ error: "Failed to create user" });
	}
};

export const getAllUsers = async (req: Request, res: Response) => {
	try {
		const users = await prisma.user.findMany();
		res.json(users);
	} catch {
		return res.status(500).json({ error: "Failed to fetch users" });
	}
};
