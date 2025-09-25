import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const getAllBugs = async (req, res) => {
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
		res.status(500).json({ msg: "Failed to fetch bugs" });
	}
};

export const getBug = async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		if (!Number.isInteger(id))
			return res.status(400).json({ error: "Invalid bug ID" });

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

export const createBug = async (req, res) => {
	try {
		const { title, description, status, priority, userId } = req.body;
		const userIdNum = Number(userId);

		// Validation
		if (!title?.trim())
			return res.status(400).json({ msg: "Title is required" });
		if (!Number.isInteger(userIdNum))
			return res.status(400).json({ msg: "Valid userId is required" });

		const bug = await prisma.bug.create({
			data: {
				title: title.trim(),
				description: description?.trim() || null,
				status,
				priority,
				author: {
					connect: { id: userIdNum },
				},
			},
		});
		res.status(201).json(bug);
	} catch (error) {
		if (error.code === "P2025") {
			return res.status(404).json({ error: "User not found" });
		}
		console.log(error);
		res.status(500).json({ error: "Failed to create bug" });
	}
};
