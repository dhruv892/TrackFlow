import { Router } from "express";
import { createUser, getAllUsers, getUser } from "../controllers/userController.js";

const router = Router();

// GET /api/users
router.get("/", getAllUsers);

// GET /api/users/:userId
router.get("/:userId", getUser)

// POST /api/users/
// body:
//	email: string
//	name: string
router.post("/", createUser);

export default router;
