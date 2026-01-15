import { register, verifyCode, login } from "../controllers/auth.controller.js";
import express from "express";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyCode);
router.post("/login", login);

export default router;
