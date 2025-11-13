import { Router } from "express";
import {
  addUserToProject,
  createProject,
  deleteProject,
  getAllProjects,
  removeUserFromProject,
  updateProject,
} from "../controllers/projectController.js";
import { auth } from "../middleware/auth.js";
import { getAllBugs } from "../controllers/bugController.js";

const router = Router();

// get all projects
// GET /api/projects
router.get("/", getAllProjects);

//post: /api/projects
router.post("/", createProject);

// // Bugs
// // GET /api/projects/:projectId/bugs
// router.get("/:projectId/bugs", getAllBugs);

//put: /api/projects/:projectId
router.put("/:projectId", updateProject);

//delete: /api/projects/:projectId
router.delete("/:projectId", deleteProject);

//post: /:id/users to add users to project
// body: { email: string }
router.post("/:projectId/users", addUserToProject);

//delete: :id/users/:userId to remove user from project
// body: { email: string }
router.delete("/:projectId/users", removeUserFromProject);

// for getting all bugs and creating bug
router.get("/:projectId/bugs", getAllBugs);

export default router;
