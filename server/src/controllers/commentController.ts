import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import { CustomError, InternalServerError, NotFoundError, ValidationError } from "../errors/CustomError.js";

type BugIdParam = { bugId: string }
export const getAllComments = async (req: Request<BugIdParam>, res: Response, next: NextFunction) => {
	try {
		const bugId = Number(req.params.bugId);
		const comments = await prisma.bug.findUnique({
			where: { id: bugId },
			select: {
				comments: true
			}
		})

		if (comments === null)
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

type CommentIdParam = { id: string }
export const getComment = async (req: Request<CommentIdParam>, res: Response, next: NextFunction) => {
	try {
		const id = Number(req.params.id);

		if (!id || Number.isNaN(id) || !Number.isInteger(id)) {
			throw new ValidationError("Invalid ID provided.")
		}

		const comment = await prisma.comment.findUnique({
			where: { id: id }
		})

		res.status(200).json(comment)
	} catch (error) {
		console.error(error)
		next(error)
	}
}

type createCommentBody = {
	content: string,
	authorId: number,
}
export const createComment = async (req: Request<BugIdParam, any, createCommentBody>, res: Response, next: NextFunction) => {
	try {
		const bugId = Number(req.params.bugId);
		const { content, authorId } = req.body;

		// Validation
		if (Number.isNaN(bugId) || !Number.isInteger(bugId)) {
			throw new ValidationError("BugId is invalid")
		}

		if (!content || content.trim().length === 0) {
			throw new ValidationError("Comment should not be empty or only white spaces.")
		}

		const bug = await prisma.bug.findUnique({
			where: { id: bugId }
		})
		if (!bug)
			throw new NotFoundError(`Bug with id ${bugId} does not exist`)

		const user = await prisma.user.findUnique({
			where: { id: authorId }
		})
		if (!user)
			throw new NotFoundError(`User with id ${authorId} does not exist`)

		const commentData = {
			content: content,
			author: { connect: { id: authorId } },
			bug: { connect: { id: bugId } }
		}

		const comment = await prisma.comment.create({ data: commentData });
		res.status(201).json(comment)
	} catch (error) {
		console.error(error);
		if (error instanceof CustomError)
			return next(error);
		else
			return next(new InternalServerError("Something went wrong."))
	}
}

/*
 * Update comment
 * Get one comment
 * Edit one comment
 * delete one comment
 */
