import { Router } from "express";
import { createUser, loginUser } from "../controllers/userController.js";

const router = Router();

// POST /api/users/
// body:
//	email: string
//	name: string
router.post("/register", createUser);

router.post("/login", loginUser)

export default router;
