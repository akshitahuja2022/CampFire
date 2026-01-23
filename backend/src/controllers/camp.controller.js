import asyncWrapper from "../utils/asyncWrapper.util.js";
import Camp from "../models/camp.model.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import ApiError from "../utils/ApiError.util.js";
import sendResponse from "../utils/sendResponse.util.js";
import { normalizeTitle, findDuplicate } from "../utils/duplicateCamp.util.js";
import addLog from "../utils/log.util.js";

const createCamp = asyncWrapper(async (req, res) => {
  const userId = req.userId;
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
  addLog(camp._id, "User");

  return sendResponse(res, 201, "Camp created successfully", camp);
});

const joinCamp = asyncWrapper(async (req, res) => {
  const userId = req.userId;
  const campId = req.params.id;
  if (!campId) throw new ApiError("Camp id is required in the URL", 400);

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

  addLog(camp._id, "User");

  sendResponse(res, 201, "You joinned the Camp", data);
});

const fetchCamps = asyncWrapper(async (req, res, query) => {
  const limit = 10;
  const sortField = req?.sortBy
    ? { totalUsers: -1, _id: -1 }
    : { createdAt: -1, _id: -1 };

  if (!req.body?.cursor) {
    const camps = await Camp.find(query).limit(limit).sort(sortField);

    const cursor =
      camps.length > 0
        ? {
            createdAt: camps[camps.length - 1].createdAt,
            _id: camps[camps.length - 1]._id,
          }
        : null;

    return sendResponse(res, 200, "Camps fetched", { camps, cursor });
  }

  const { cursor } = req.body;

  const paginationQuery = {
    ...query,
    $or: [
      { createdAt: { $lt: cursor.createdAt } },
      { createdAt: cursor.createdAt, _id: { $lt: cursor._id } },
    ],
  };

  const camps = await Camp.find(paginationQuery).limit(limit).sort(sortField);

  const newCursor =
    camps.length > 0
      ? {
          createdAt: camps[camps.length - 1].createdAt,
          _id: camps[camps.length - 1]._id,
        }
      : null;

  sendResponse(res, 200, "Camps fetched", { camps, cursor: newCursor });
});

const trendingCamps = (req, res) => {
  const query = {
    totalUsers: { $gte: 14 },
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  };
  return fetchCamps(req, res, query);
};

const topCamps = (req, res) => {
  const query = {
    totalUsers: { $gte: 20 },
    createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  };
  req.sortBy = "totalUsers";
  return fetchCamps(req, res, query);
};

const personalisedCamps = asyncWrapper(async (req, res) => {
  const userId = req.userId;
  const user = await User.findById(userId).select("interests").lean();

  const query =
    user.interests.length > 0
      ? {
          category: { $in: user.interests },
        }
      : {};
  return fetchCamps(req, res, query);
});

export { createCamp, joinCamp, trendingCamps, topCamps, personalisedCamps };
