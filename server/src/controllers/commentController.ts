import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import {
  CustomError,
  InternalServerError,
  NotFoundError,
  ValidationError,
} from "../errors/CustomError.js";

type BugIdParam = { bugId: string };
export const getAllComments = async (
  req: Request<BugIdParam>,
  res: Response,
  next: NextFunction
) => {
  try {
    const bugId = Number(req.params.bugId);
    const comments = await prisma.bug.findUnique({
      where: { id: bugId },
      select: {
        comments: {
          include: {
            author: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (comments === null)
      throw new NotFoundError(`Bug with id ${bugId} doesn't exist.`);

    console.log(comments);
    res.status(200).json(comments);
  } catch (error) {
    if (error instanceof CustomError) return next(error);
    else return next(new InternalServerError("Failed to fetch comments."));
  }
};

type CommentIdParam = { commentId: string };
export const getComment = async (
  req: Request<CommentIdParam>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.commentId);

    if (!id || Number.isNaN(id) || !Number.isInteger(id)) {
      throw new ValidationError("Invalid ID provided.");
    }

    const comment = await prisma.comment.findUnique({
      where: { id: id },
    });

    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

type createCommentBody = {
  content: string;
  authorId: number;
};
export const createComment = async (
  req: Request<BugIdParam, any, createCommentBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const bugId = Number(req.params.bugId);
    if (Number.isNaN(bugId) || !Number.isInteger(bugId)) {
      throw new ValidationError("BugId is invalid");
    }
    const { content } = req.body;
    // console.log("req.user:", req.user);
    const userId = req.user?.userId;
    if (!userId) {
      throw new ValidationError("Invalid authorId.");
    }
    // console.log("userId:", userId);

    if (!userId || Number.isNaN(userId) || !Number.isInteger(userId)) {
      throw new ValidationError("Invalid authorId.");
    }

    // Validation
    if (Number.isNaN(bugId) || !Number.isInteger(bugId)) {
      throw new ValidationError("BugId is invalid");
    }

    if (!content || content.trim().length === 0) {
      throw new ValidationError(
        "Comment should not be empty or only white spaces."
      );
    }

    const bug = await prisma.bug.findUnique({
      where: { id: bugId },
    });
    if (!bug) throw new NotFoundError(`Bug with id ${bugId} does not exist`);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundError(`User with id ${userId} does not exist`);

    const commentData = {
      content: content,
      author: { connect: { id: userId } },
      bug: { connect: { id: bugId } },
    };

    const comment = await prisma.comment.create({
      data: commentData,
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    if (error instanceof CustomError) return next(error);
    else return next(new InternalServerError("Something went wrong."));
  }
};

type UpdateCommentParams = {
  commentId: string;
};
type UpdateCommentBody = {
  content: string;
};

export const updateComment = async (
  req: Request<UpdateCommentParams, any, UpdateCommentBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentId = Number(req.params.commentId);
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      throw new ValidationError("Content is required.");
    }

    if (Number.isNaN(commentId) || !Number.isInteger(commentId)) {
      throw new ValidationError("CommentId is invalid");
    }

    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: { content: content },
    });

    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    if (error instanceof CustomError) return next(error);
    else return next(new InternalServerError("Internal server error"));
  }
};

type DeleteCommentParam = {
  commentId: string;
};
export const deleteComment = async (
  req: Request<DeleteCommentParam, any, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentId = Number(req.params.commentId);

    if (Number.isNaN(commentId) || !Number.isInteger(commentId)) {
      throw new ValidationError("CommentId is invalid");
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment)
      throw new NotFoundError(`Comment with id ${commentId} does not exist.`);

    const deletedComment = await prisma.comment.delete({
      where: { id: commentId },
    });

    return res.status(200).json(deletedComment);
  } catch (error) {
    console.error(error);
    if (error instanceof CustomError) return next(error);
    else return next(new InternalServerError("Internal server error"));
  }
};
