/*
model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  name    String?
  bugs Bug[]
}
*/

import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const createUser = async (req, res) => {
	const { email, name } = req.body;
	console.log(email, name);
	const user = await prisma.user.create({
		data: {
			email,
			name,
		},
	});
	console.log(user);
	res.send("Received");
};

export const getAllUsers = async (req, res) => {
	const users = await prisma.user.findMany();
	res.send(users);
};
