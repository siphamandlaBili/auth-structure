import express from "express";
import { login, logout, signup, verifyEmail } from "../constrollers/authControllers.js";

const router = express.Router();

router.get("/login",login)

router.get("/logout",logout)

router.post("/signup",signup)

router.post("/verify-email",verifyEmail)

export default router;