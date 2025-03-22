import express from "express";
import { login, logout, signup, verifyEmail,forgotPassword } from "../constrollers/authControllers.js";

const router = express.Router();

router.post("/login",login)

router.post("/logout",logout)

router.post("/signup",signup)

router.post("/verify-email",verifyEmail)

router.post("/forgot-password",forgotPassword)

export default router;