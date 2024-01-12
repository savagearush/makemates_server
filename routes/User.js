import { Router } from "express";
import {
  login,
  register,
  getUserData,
  updateUserInfo,
} from "../controller/User.js";
import auth from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/update", auth, updateUserInfo);
router.get("/me", auth, getUserData);

export default router;
