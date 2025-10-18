import { Router } from "express";
import { createUser, getAllUsers, getUser } from "../controllers/userController.js";

const router = Router();

// GET all users
router.get("/", getAllUsers);

// GET one user
router.get("/:userId", getUser)

// POST create user
router.post("/", createUser);

export default router;
