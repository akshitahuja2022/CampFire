import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.util.js";
import sendResponse from "../utils/sendResponse.util.js";
import asyncWrapper from "../utils/asyncWrapper.util.js";
import { genrateToken } from "../utils/token.util.js";
import { authCode, sendCode } from "../utils/email.util.js";

const register = asyncWrapper(async (req, res) => {
  const { name, username, email, password } = req.body;

  if (![name, username, email, password].every((v) => v?.trim())) {
    throw new ApiError("All fields are required", 400);
  }

  const user = User({
    name,
    username,
    email,
    password,
  });
  await user.save();

  const code = await sendCode(user.email, user._id);
  if (!code) throw new ApiError("Failed to send email", 401);

  res.cookie("token", code, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 10 * 60 * 1000,
  });
  sendResponse(res, 200, "Otp sent");
});

const verifyCode = asyncWrapper(async (req, res) => {
  const { code } = req.body;
  if (!code) throw new ApiError("Incorrect Otp", 401);

  const rawToken = req.cookies?.token;
  if (!rawToken) throw new ApiError("Verification token missing", 401);

  const verify = await authCode(rawToken, code);
  if (!verify) throw new ApiError("Invalid OTP", 401);

  const user = await User.findById(verify);
  if (!user) throw new ApiError("User not found, register again", 401);

  user.isVerified = true;
  await user.save();

  const token = genrateToken(user._id);
  res.clearCookie("token").cookie("uid", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, 201, "User registered", {
    name: user.name,
    username: user.username,
    email: user.email,
  });
});

const login = asyncWrapper(async (req, res) => {
  const { username, password } = req.body;

  if (![username, password].every((v) => v?.trim())) {
    throw new ApiError("All fields are required", 400);
  }

  const user = await User.findOne({ username }).select("+password");
  if (!user) throw new ApiError("Invalid credentials", 400);
  if (!user.isVerified) throw new ApiError("Account not verified", 403);

  const isValid = await user.verifyPassword(password);
  if (!isValid) throw new ApiError("Invalid credentials", 400);

  const token = genrateToken(user._id);

  res.cookie("uid", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, 200, "Login successful", {
    name: user.name,
    username: user.username,
    email: user.email,
  });
});

export { register, login, verifyCode };
