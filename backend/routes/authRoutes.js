import express from "express";
import { login, logout, signup, verifyEmail,forgotPassword,resetPassword ,verifyAuth} from "../constrollers/authControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/check-auth",verifyToken,verifyAuth);

router.post("/login",login)
router.post("/logout",logout)
router.post("/signup",signup)

router.post("/verify-email",verifyEmail)
router.post("/forgot-password",forgotPassword)

router.post("/reset-password/:token",resetPassword)

export default router;