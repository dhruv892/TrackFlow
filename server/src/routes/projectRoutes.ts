import { Router } from "express";
import {
  createProject,
  deleteProject,
  getAllProjects,
  updateProject,
} from "../controllers/projectController.js";
import { auth } from "../middleware/auth.js";
import { getAllBugs } from "../controllers/bugController.js";

const router = Router();

router.use(auth);

// get all projects
// GET /api/projects
router.get("/", getAllProjects);

//post: /api/projects
router.post("/", createProject);

//put: /api/projects/:projectId
// body: { name?: string, description?: string }
router.patch("/:projectId", updateProject);

//delete: /api/projects/:projectId
router.delete("/:projectId", deleteProject);

// for getting all bugs and creating bug
// GET /api/projects/:projectId/bugs
router.get("/:projectId/bugs", getAllBugs);

export default router;
