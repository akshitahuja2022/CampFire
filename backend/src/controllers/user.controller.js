import mongoose from "mongoose";
import User from "../models/user.model.js";
import asyncWrapper from "../utils/asyncWrapper.util.js";
import ApiError from "../utils/ApiError.util.js";
import sendResponse from "../utils/sendResponse.util.js";

const changePassword = asyncWrapper(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    throw new ApiError("All fields are required", 400);

  const user = await User.findById(req.userId).select("+password");
  if (!user) throw new ApiError("User not found", 404);

  const isValid = await user.verifyPassword(oldPassword);
  if (!isValid) throw new ApiError("Old password is incorrect", 400);

  user.password = newPassword;
  await user.save();

  sendResponse(res, 200, "Password updated successfully");
});

const changeMetaData = asyncWrapper(async (req, res) => {
  const { name, username } = req.body;
  if (!name || !username) throw new ApiError("All fields are required", 400);

  const usernameExists = await User.exists({
    username,
    _id: { $ne: new mongoose.Types.ObjectId(req.userId) },
  });
  if (usernameExists) throw new ApiError("Username already exists", 409);

  const user = await User.findById(req.userId).select("username name");
  if (!user) throw new ApiError("User not found", 404);

  user.name = name;
  user.username = username;

  await user.save();

  sendResponse(res, 200, "Profile updated successfully", {
    name: user.name,
    username: user.username,
  });
});

export { changePassword, changeMetaData };
