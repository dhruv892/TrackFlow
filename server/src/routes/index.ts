import { Router } from "express";
import bugsRouter from "./bugs.js";

const router = Router();

router.use("/bugs", bugsRouter);

export default router;
