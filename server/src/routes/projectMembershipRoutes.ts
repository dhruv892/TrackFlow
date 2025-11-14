import express from "express";
import { auth } from "../middleware/auth.js";
import {
  addUserToProject,
  getProjectMembers,
  removeUserFromProject,
  updateUserRole,
} from "../controllers/projectMembershipController.js";

const router = express.Router();

router.use(auth);

// body: { email: string, role: 'ADMIN' | 'MEMBER' }
// POST: /api/project-membership/add/:projectId
router.post("/add/:projectId", addUserToProject);

// body: { email: string }
// DELETE: /api/project-membership/remove/:projectId
router.delete("/remove/:projectId", removeUserFromProject);

// body: { email: string, role: 'ADMIN' | 'MEMBER' }
// PATCH: /api/project-membership/update-role/:projectId
router.patch("/update-role/:projectId", updateUserRole);

// GET: /api/project-membership/members/:projectId
router.get("/members/:projectId", getProjectMembers);

export default router;
