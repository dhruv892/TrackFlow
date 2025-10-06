import { Router } from "express";
import { deleteComment, getComment, updateComment } from "../controllers/commentController.js";

const router = Router();

// GET /api/comments/:id
router.get("/:id", getComment)

// PUT /api/comments/:commentId
router.put("/:commentId", updateComment)

// DELEtE /api/comments/:commentId
router.delete("/:commentId", deleteComment)

export default router;
