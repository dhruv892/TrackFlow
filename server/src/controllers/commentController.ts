import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import { CustomError, InternalServerError, NotFoundError, ValidationError } from "../errors/CustomError.js";
import { connect } from "http2";

type BugIdParam = { id: String }
export const getAllCommentsOfBug = async (req: Request<BugIdParam>, res: Response, next: NextFunction) => {
	try {
		const bugId = Number(req.params.id);
		const comments = await prisma.bug.findUnique({
			where: { id: bugId },
			select: {
				comments: true
			}
		})

		if (comments === null || comments === undefined)
			throw new NotFoundError(`Bug with id ${bugId} doesn't exist.`)

		console.log(comments);
		res.status(200).json(comments);
	} catch (error) {
		if (error instanceof CustomError)
			return next(error);
		else
			return next(new InternalServerError("Failed to fetch comments."))
	}
}

type createCommentBody = {
	content: string,
	authorId: number,
	bugId: number
}
export const createComment = async (req: Request<{}, any, createCommentBody>, res: Response, next: NextFunction) => {
	try {
		const { content, authorId, bugId } = req.body;

		// Validation
		if (content?.trim().length === 0) {
			throw new ValidationError("Comment should not be empty or only white spaces.")
		}

		const commentData = {
			content: content,
			author: { connect: { id: authorId } },
			bug: { connect: { id: bugId } }
		}

		const comment = await prisma.comment.create({ data: commentData });
		console.log(comment);
		res.status(201).json(comment)

	} catch (error) {
		console.error(error);
		next(error);
	}
}
