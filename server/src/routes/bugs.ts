import { Router } from "express";
import { getAllBugs, getBug } from "../controllers/bugController.js";

const router = Router();

// GET /api/bugs - Get all bugs
router.get("/", getAllBugs);

// GET /api/bugs/:id - Get single bug
router.get("/:id", getBug);

export default router;
