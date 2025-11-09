import { Router } from "express";
import {
  createUser,
  loginUser,
  logoutUser,
} from "../controllers/userController.js";

const router = Router();

// POST /api/users/
// body:
//	email: string
//	name: string
router.post("/register", createUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

export default router;
