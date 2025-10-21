import { Router } from "express";
import { createUser, deleteUser, getAllUsers, getUser, getUserDeletionInfo, loginUser, updateUser } from "../controllers/userController.js";

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

// PUT /api/users/:userId
// body:
//	email?: string,
//	name?: string,
//	password?: string
router.put("/:userId", updateUser)

// GET /api/users/:userId/delete-info
router.get("/:userId/delete-info", getUserDeletionInfo)

// DELETE /api/users/:userId
router.delete("/:userId", deleteUser)

router.post("/login", loginUser)

export default router;
