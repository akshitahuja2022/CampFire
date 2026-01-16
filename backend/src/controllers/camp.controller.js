import asyncWrapper from "../utils/asyncWrapper.util.js";
import Camp from "../models/camp.model.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Message from "../models/message.model.js";
import ApiError from "../utils/ApiError.util.js";
import sendResponse from "../utils/sendResponse.util.js";
import { decodeToken } from "../utils/token.util.js";
import { normalizeTitle, findDuplicate } from "../utils/duplicateCamp.util.js";

const createCamp = asyncWrapper(async (req, res) => {
  const token = req.cookies?.uid;
  const userId = decodeToken(token);
  const { title, description, category } = req.body;

  const campExist = await Camp.exists({ createdBy: userId });
  if (campExist) throw new ApiError("User has already created a camp", 409);

  const duplicate = await findDuplicate(title);
  if (duplicate)
    return sendResponse(res, 409, "A similar camp already exists", duplicate);

  const keywords = normalizeTitle(title);

  const camp = await Camp.create({
    title,
    keywords,
    description,
    category,
    createdBy: userId,
    burnAt: Date.now() + 72 * 60 * 60 * 1000,
  });

  await User.findByIdAndUpdate(userId, {
    $push: { camps: camp._id },
  });

  return sendResponse(res, 201, "Camp created successfully", camp);
});

const joinCamp = asyncWrapper(async (req, res) => {
  const token = req.cookies?.uid;
  const userId = decodeToken(token);
  const { campId } = req.body;

  const user = await User.findById(userId);
  if (!user) throw new ApiError("User doesn't exists", 401);

  const camp = await Camp.findById(campId);
  if (!camp) throw new ApiError("Camp doesn't exists", 404);

  if (user.camps.includes(camp._id))
    throw new ApiError("User already joined this camp", 400);

  user.camps.push(camp._id);
  camp.totalUsers += 1;
  await Promise.all([user.save(), camp.save()]);

  const posts = await Post.find({ campId: camp._id })
    .populate("userId", "name username _id")
    .sort({ createdAt: -1 })
    .limit(40);

  const data = {
    campId: camp._id,
    createdBy: camp.createdBy,
    totalUsers: camp.totalUsers,
    burnAt: camp.burnAt,
    createdAt: camp.createdAt,
    posts,
  };

  sendResponse(res, 201, "You joinned the Camp", data);
});

export { createCamp, joinCamp };
