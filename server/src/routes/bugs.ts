import { Router } from "express";
import { createBug, getAllBugs, getBug } from "../controllers/bugController.js";

const router = Router();

// GET /api/bugs - Get all bugs
router.get("/", getAllBugs);

// GET /api/bugs/:id - Get single bug
router.get("/:id", getBug);

// POST /api/bugs - Create a bug
router.post("/", createBug);

export default router;
