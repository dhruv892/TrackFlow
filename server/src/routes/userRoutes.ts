import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  getUserDeletionInfo,
  loginUser,
  updateUser,
} from "../controllers/userController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

// GET /api/users
router.get("/", getAllUsers);

// GET /api/users/me
router.get("/me", getUser);

// PUT /api/users/:userId
// body:
//	email?: string,
//	name?: string,
//	password?: string
router.put("/", updateUser);

// GET /api/users/:userId/delete-info
router.get("/:userId/delete-info", getUserDeletionInfo);

// DELETE /api/users/:userId
router.delete("/:userId", deleteUser);

export default router;
