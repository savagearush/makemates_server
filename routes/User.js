import { Router } from "express";
import { login, register, getUserData } from "../controller/User.js";
import auth from "../middleware/auth.js"

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/me", getUserData);

export default router;
