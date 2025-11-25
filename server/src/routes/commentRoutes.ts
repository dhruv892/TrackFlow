import { Router } from "express";
import {
  deleteComment,
  getComment,
  updateComment,
} from "../controllers/commentController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.use(auth);

// GET /api/comments/:commentId
router.get("/:commentId", getComment);

// PUT /api/comments/:commentId
// body:
//	content: string
router.put("/:commentId", updateComment);

// DELETE /api/comments/:commentId
router.delete("/:commentId", deleteComment);

export default router;
