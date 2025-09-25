import { Router } from "express";
import { createUser, getAllUsers } from "../controllers/userController.js";

const router = Router();

// GET all users
router.get("/", getAllUsers);

// POST create user
router.post("/", createUser);

export default router;
