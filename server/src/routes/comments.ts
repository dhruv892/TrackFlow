import { Router } from "express";
import { getComment } from "../controllers/commentController.js";

const router = Router();

router.get("/:id", getComment)

export default router;
