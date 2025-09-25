import { Router } from "express";
import { createBug, getAllBugs, getBug } from "../controllers/bugController.js";

const router = Router();

// GET /api/bugs - Get all bugs
router.get("/", getAllBugs);

// POST /api/bugs - Create a new bug
router.post("/", createBug);

// GET /api/bugs/:id - Get single bug
router.get("/:id", getBug);

export default router;
