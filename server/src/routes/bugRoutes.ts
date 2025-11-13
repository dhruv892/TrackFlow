import { Router } from "express";
import {
  assignUserToBug,
  createBug,
  deleteBug,
  getAllBugs,
  getBug,
  removeAllAssignedUsers,
  removeAssignedUsers,
  updateBug,
} from "../controllers/bugController.js";
import {
  createComment,
  getAllComments,
} from "../controllers/commentController.js";

const router = Router();

// ---------------------------------
// Comments
// GET /api/bugs/:bugId/comments
router.get("/:bugId/comments", getAllComments);

// POST /api/bugs/:bugId/comments
// Body:
//	content: string
//	authorId: number
router.post("/:bugId/comments", createComment);

// ---------------------------------
// Assignees
// POST /api/bugs/:bugId/assignees
// Body:
//	userIds: number[]
router.post("/:bugId/assignees", assignUserToBug);

// DELETE /api/bugs/:bugId/assignees/all
router.delete("/:bugId/assignees/all", removeAllAssignedUsers);
// DELETE /api/bugs/:bugId/assignees
// Body:
//	userIds: number[]
router.delete("/:bugId/assignees", removeAssignedUsers);

// ---------------------------------
// Bugs
// GET /api/bugs
// this is in projectRoutes.ts
// router.get("/", getAllBugs);

// GET /api/bugs/:bugId
router.get("/:bugId", getBug);

// POST /api/bugs
// Body:
//	title: string
//	userId: number
//	description?: string
//	status?: BugStatus
//	priority: PriorityStates

router.post("/:projectId", createBug);

// PUT /api/bugs/:bugId
// body:
//	title?: string;
//	description?: string;
//	status?: BugStatus;
//	priority?: PriorityStates;
router.put("/:bugId", updateBug);

// DELETE /api/bugs/:bugId
router.delete("/:bugId", deleteBug);

export default router;
