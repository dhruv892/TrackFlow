import { Router } from "express";
import bugsRouter from "./bugs.js";
import userRouter from "./users.js";

const router = Router();

router.use("/bugs", bugsRouter);
router.use("/users/", userRouter);

export default router;
