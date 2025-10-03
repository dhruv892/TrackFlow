import { Router } from "express";
import { createComment, getAllCommentsOfBug } from "../controllers/commentController.js";

const router = Router();

router.get("/:id", getAllCommentsOfBug);
router.post("/", createComment)

export default router;
