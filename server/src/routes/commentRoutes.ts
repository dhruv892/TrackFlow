import { Router } from "express";
import { deleteComment, getComment, updateComment } from "../controllers/commentController.js";

const router = Router();

// GET /api/comments/:commentId
router.get("/:commentId", getComment)

// PUT /api/comments/:commentId
// body:
//	content: string
router.put("/:commentId", updateComment)

// DELETE /api/comments/:commentId
router.delete("/:commentId", deleteComment)

export default router;
