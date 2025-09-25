import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const getAllBugs = async (req, res) => {
	const bugs = await prisma.bug.findMany();
	return res.status(200).json(bugs);
};

export const getBug = async (req, res) => {
	const id = parseInt(req.params.id);
	const bug = await prisma.bug.findUnique({
		where: { id },
	});
	if (bug) return res.status(200).json(bug);

	res.status(404).send(`Bug with id ${id} not found.`);
};

export const createBug = async (req, res) => {
	const { title, description, status, priority } = req.body;
	const userId = Number(req.body.userId);
	const bug = await prisma.bug.create({
		data: {
			title,
			description,
			status,
			priority,
			author: {
				connect: { id: userId },
			},
		},
	});
	res.status(200).json(bug);
};
