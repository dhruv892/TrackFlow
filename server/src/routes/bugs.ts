import { Router } from "express";
import { assignUserToBug, createBug, deleteBug, getAllBugs, getBug, removeAllAssignedUsers, removeAssignedUsers, updateBug } from "../controllers/bugController.js";
import { createComment, getAllComments } from "../controllers/commentController.js";

const router = Router();

// Comments
router.get("/:bugId/comments", getAllComments);
router.post("/:bugId/comments", createComment);

// Assignees
router.post("/:bugId/assignees", assignUserToBug);
router.delete("/:bugId/assignees/all", removeAllAssignedUsers);
router.delete("/:bugId/assignees", removeAssignedUsers);

// Bugs
router.get("/", getAllBugs);
router.get("/:bugId", getBug);
router.post("/", createBug);
router.patch("/:bugId", updateBug);
router.delete("/:bugId", deleteBug);

export default router;

