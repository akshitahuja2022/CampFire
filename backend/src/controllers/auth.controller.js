import User from "../models/user.model.js";
import Code from "../models/code.model.js";
import ApiError from "../utils/ApiError.util.js";
import sendResponse from "../utils/sendResponse.util.js";
import asyncWrapper from "../utils/asyncWrapper.util.js";
import { genrateToken } from "../utils/token.util.js";
import { authCode, sendCode } from "../utils/email.util.js";
import { getHash } from "../utils/emailToken.util.js";

const register = asyncWrapper(async (req, res) => {
  const { name, username, email, password } = req.body;

  if (![name, username, email, password].every((v) => v?.trim())) {
    throw new ApiError("All fields are required", 400);
  }
  const user = new User({
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
    sameSite: "none",
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

  if (verify.forWhat === "password") {
    const user = await User.findById(verify.user_id).select(
      "isVerified +password",
    );
    if (!user) throw new ApiError("User not found, register again", 401);

    const { password } = req.body;
    if (!password) throw new ApiError("Password not provided", 401);

    user.password = password;
    await user.save();

    return sendResponse(res, 200, "Password reset successfully");
  }

  const user = await User.findById(verify.user_id).select(
    "name username email isVerified interests",
  );
  if (!user) throw new ApiError("User not found, register again", 401);
  user.isVerified = true;
  await user.save();

  const token = genrateToken(user._id);
  res.clearCookie("token").cookie("uid", token, {
    httpOnly: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, 201, "User registered", {
    name: user.name,
    username: user.username,
    email: user.email,
    interests: user.interests,
  });
});

const resendCode = asyncWrapper(async (req, res) => {
  const rawToken = req.cookies?.token;
  if (!rawToken) throw new ApiError(401, "Authentication token missing");

  const tokenHash = getHash(rawToken);

  const codeRecord = await Code.findOne({ tokenHash }).select("email user_id");
  if (!codeRecord)
    throw new ApiError(404, "Verification code not found or expired");

  await codeRecord.deleteOne();

  const newToken = await sendCode(codeRecord.email, codeRecord.user_id);
  if (!newToken) throw new ApiError(500, "Failed to send verification email");

  res.cookie("token", newToken, {
    httpOnly: true,
    sameSite: "none",
    maxAge: 10 * 60 * 1000,
  });

  sendResponse(res, 200, "OTP sent again successfully");
});

const login = asyncWrapper(async (req, res) => {
  const { username, password } = req.body;

  if (![username, password].every((v) => v?.trim())) {
    throw new ApiError("All fields are required", 400);
  }

  const user = await User.findOne({ username }).select("+password");
  if (!user) throw new ApiError("Invalid credentials", 400);

  const isValid = await user.verifyPassword(password);
  if (!isValid) throw new ApiError("Invalid credentials", 400);

  if (!user.isVerified) {
    await Code.deleteOne({ user_id: user._id });
    const code = await sendCode(user.email, user._id);
    if (!code) throw new ApiError("Failed to send email", 401);
    res.cookie("token", code, {
      httpOnly: true,
      sameSite: "none",
      maxAge: 10 * 60 * 1000,
    });
    throw new ApiError("Account not verified", 403);
  }

  const token = genrateToken(user._id);

  res.cookie("uid", token, {
    httpOnly: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, 200, "Login successful", {
    name: user.name,
    username: user.username,
    email: user.email,
    interests: user.interests,
  });
});

const forgotPassword = asyncWrapper(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError("Email required", 400);

  const codeExists = await Code.findOne({ email });
  if (codeExists) await codeExists.deleteOne();

  const user = await User.findOne({ email }).select("email");
  if (!user) throw new ApiError("User not found", 400);

  const newToken = await sendCode(user.email, user._id, "password");
  if (!newToken) throw new ApiError(500, "Failed to send verification email");

  res.cookie("token", newToken, {
    httpOnly: true,
    sameSite: "none",
    maxAge: 10 * 60 * 1000,
  });

  sendResponse(res, 200, "Otp sent");
});

const logout = asyncWrapper(async (req, res) => {
  res.clearCookie("uid", {
    httpOnly: true,
    sameSite: "strict",
  });

  sendResponse(res, 200, "Logout successfully");
});

export { register, login, verifyCode, resendCode, forgotPassword, logout };
