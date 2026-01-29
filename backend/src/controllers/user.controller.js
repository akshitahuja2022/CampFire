import mongoose from "mongoose";
import User from "../models/user.model.js";
import asyncWrapper from "../utils/asyncWrapper.util.js";
import ApiError from "../utils/ApiError.util.js";
import sendResponse from "../utils/sendResponse.util.js";
import { deleteImage, uploadImage } from "../services/cloudinary.service.js";

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

const addInterests = asyncWrapper(async (req, res) => {
  const { interests } = req.body;
  if (!interests || interests < 0)
    throw new ApiError("Atleast one interest required", 401);

  const allowedSet = new Set([
    "tech",
    "art",
    "news",
    "sports",
    "nature",
    "photography",
    "music",
    "gaming",
    "education",
    "startup",
  ]);

  const check = interests.every((interest) =>
    allowedSet.has(interest.toLowerCase()),
  );
  if (!check) throw new ApiError("Only allowed interests can be added", 400);

  const user = await User.findById(req.userId).select("interests");
  if (!user) throw new ApiError("User not found", 404);

  user.interests = interests;
  await user.save();

  sendResponse(res, 200, "Interests added");
});

const updateAvatar = asyncWrapper(async (req, res) => {
  const file = req?.file;
  if (!file) throw new ApiError("File required", 401);

  const avatar = await uploadImage(file.path);
  if (!avatar) throw new ApiError("Image not uploaded", 400);

  const user = await User.findById(req.userId).select("avatar username");
  if (!user) throw new ApiError("User not found", 404);

  const oldAvatar = user.avatar;
  if (oldAvatar.url) await deleteImage(oldAvatar.id);

  user.avatar = avatar;
  await user.save();

  const data = {
    url: user.avatar.url,
  };

  sendResponse(res, 200, "Avatar updated", data);
});

const removeAvatar = asyncWrapper(async (req, res) => {
  const user = await User.findById(req.user).select("avatar");
  if (!user) throw new ApiError("User not found", 404);

  const deleted = await deleteImage(user.avatar.id);
  if (!deleted) ApiError("Failed to remover avatar", 401);

  user.avatar = { id: null, url: null };
  await user.save();

  sendResponse(res, 200, "Avatar removed successfully");
});

const getUser = asyncWrapper(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) throw new ApiError("User not found", 400);

  sendResponse(res, 200, "User data", user);
});

export {
  changePassword,
  changeMetaData,
  addInterests,
  updateAvatar,
  removeAvatar,
  getUser,
};
