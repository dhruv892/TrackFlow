import { Router } from "express";
import { createBug, deleteBug, getAllBugs, getBug, updateBug } from "../controllers/bugController.js";

const router = Router();

// GET /api/bugs - Get all bugs
router.get("/", getAllBugs);

// GET /api/bugs/:id - Get single bug
router.get("/:id", getBug);

// POST /api/bugs - Create a bug
router.post("/", createBug);

// PUT /api/bugs/:id - Update a bug
router.put("/:id", updateBug)

// DELETE /api/bugs/:id - Delete a bug
router.delete("/:id", deleteBug)

export default router;
