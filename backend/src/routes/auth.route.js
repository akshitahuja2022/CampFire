import {
  register,
  verifyCode,
  resendCode,
  login,
} from "../controllers/auth.controller.js";
import express from "express";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyCode);
router.get("/resend-otp", resendCode);
router.post("/login", login);

export default router;
