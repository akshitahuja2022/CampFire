import asyncWrapper from "../utils/asyncWrapper.util.js";
import Camp from "../models/camp.model.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import ApiError from "../utils/ApiError.util.js";
import sendResponse from "../utils/sendResponse.util.js";
import { normalizeTitle, findDuplicate } from "../utils/duplicateCamp.util.js";
import addLog from "../utils/log.util.js";
import { uploadImage } from "../services/cloudinary.service.js";
import { setCache, getCache } from "../utils/cache.util.js";
import { adjustUserCount } from "../utils/cache.util.js";

const createCamp = asyncWrapper(async (req, res) => {
  const userId = req.userId;
  const { title, description, category } = req.body;

  const campExist = await Camp.exists({ createdBy: userId });
  if (campExist) throw new ApiError("User has already created a camp", 409);

  const duplicate = await findDuplicate(title);
  if (duplicate)
    return sendResponse(res, 409, "A similar camp already exists", duplicate);

  const keywords = normalizeTitle(title);

  let thumbnail = { id: null, url: null };
  let thumbnailUploaded = true;
  if (req.file) {
    const uploaded = await uploadImage(req.file.path, "thumbnail");
    thumbnail = {
      id: uploaded.id,
      url: uploaded.url,
    };
    if (!uploaded) thumbnailUploaded = false;
  }

  const camp = await Camp.create({
    title,
    keywords,
    description,
    category,
    createdBy: userId,
    thumbnail,
    burnAt: Date.now() + 72 * 60 * 60 * 1000,
  });

  await User.findByIdAndUpdate(userId, {
    $push: { camps: camp._id },
  });
  addLog(camp._id, "User");
  await adjustUserCount(camp._id, camp.totalUsers);

  const message = thumbnailUploaded
    ? "Camp created successfully."
    : "Camp created successfully, but the thumbnail upload failed.";

  return sendResponse(res, 201, message, camp);
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
  await adjustUserCount(camp._id, camp.totalUsers);
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

const leaveCamp = asyncWrapper(async (req, res) => {
  const campId = req.params.id;
  if (!campId) throw new ApiError("campId is required", 400);

  const user = await User.findById(req.userId).select("camps");
  if (!user) throw new ApiError("User not found", 404);

  const isInCamp = user.camps.some((id) => id.toString() === campId);
  if (!isInCamp) throw new ApiError("User is not part of this camp", 409);

  user.camps.pull(campId);
  await user.save();

  const camp = await Camp.findById(campId).select("totalUsers");
  await adjustUserCount(camp._id, camp.totalUsers, -1);
  camp.totalUsers -= 1;
  await camp.save();

  sendResponse(res, 200, "Successfully left the camp", { campId });
});

const fetchCamps = async ({
  field = "trendingScore",
  limit = 10,
  cursor = null,
}) => {
  try {
    if (!cursor) {
      const camps = await Camp.find()
        .sort({ [field]: -1, _id: -1 })
        .limit(limit);

      const newCursor =
        camps.length > 0
          ? {
              value: camps[camps.length - 1][field],
              _id: camps[camps.length - 1]._id,
            }
          : null;

      return { camps, cursor: newCursor };
    }

    const camps = await Camp.find({
      $or: [
        { [field]: { $lt: cursor.value } },
        { [field]: cursor.value, _id: { $lt: cursor._id } },
      ],
    })
      .sort({ [field]: -1, _id: -1 })
      .limit(limit);

    const newCursor =
      camps.length > 0
        ? {
            value: camps[camps.length - 1][field],
            _id: camps[camps.length - 1]._id,
          }
        : null;

    return { camps, cursor: newCursor };
  } catch (error) {
    throw new ApiError("Failed to fetch camps", 500);
  }
};

const trendingCamps = asyncWrapper(async (req, res) => {
  const keyId = req.body?.cursor || "none";
  const cache = await getCache("trendingCamps", keyId);
  if (cache) {
    return sendResponse(res, 200, "Trending Camps", cache);
  }

  const { camps, cursor } = await fetchCamps({
    field: "trendingScore",
    limit: 10,
    cursor: req.body?.cursor,
  });

  await setCache("trendingCamps", camps, cursor, keyId);

  sendResponse(res, 200, "Trending Camps", { camps, cursor });
});

const topCamps = asyncWrapper(async (req, res) => {
  const keyId = req.body?.cursor || "none";
  const cache = await getCache("topCamps", keyId);
  if (cache) {
    return sendResponse(res, 200, "Top Camps", cache);
  }

  const { camps, cursor } = await fetchCamps({
    field: "topScore",
    limit: 10,
    cursor: req.body?.cursor,
  });

  await setCache("topCamps", camps, cursor, keyId);

  sendResponse(res, 200, "Top Camps", { camps, cursor });
});

const personalisedCamps = asyncWrapper(async (req, res) => {
  const userId = req.userId;
  const cursor = req.body?.cursor || null;

  const user = await User.findById(userId).select("interests camps").lean();

  const baseQuery = { _id: { $nin: user.camps } };

  if (user.interests.length > 0) {
    baseQuery.category = { $in: user.interests };
  }

  if (cursor) {
    baseQuery.$or = [
      { createdAt: { $lt: cursor.createdAt } },
      {
        createdAt: cursor.createdAt,
        _id: { $lt: cursor._id },
      },
    ];
  }

  const camps = await Camp.find(baseQuery)
    .sort({ createdAt: -1, _id: -1 })
    .limit(10);

  if (camps.length === 0) {
    return sendResponse(res, 200, "Camps fetched", {
      camps: [],
      cursor: null,
    });
  }

  const newCursor = {
    createdAt: camps[camps.length - 1].createdAt,
    _id: camps[camps.length - 1]._id,
  };

  sendResponse(res, 200, "Camps fetched", {
    camps,
    cursor: newCursor,
  });
});

const myCamps = asyncWrapper(async (req, res) => {
  const camps = await User.findById(req.userId)
    .select("camps")
    .populate("camps", "title description burnAt totalUsers category");

  sendResponse(res, 200, "Camps fetched", camps);
});

export {
  createCamp,
  joinCamp,
  leaveCamp,
  trendingCamps,
  topCamps,
  personalisedCamps,
  myCamps,
};
