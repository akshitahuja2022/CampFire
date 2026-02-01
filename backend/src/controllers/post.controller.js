import asyncWrapper from "../utils/asyncWrapper.util.js";
import Camp from "../models/camp.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import ApiError from "../utils/ApiError.util.js";
import sendResponse from "../utils/sendResponse.util.js";
import addLog from "../utils/log.util.js";
import { uploadImage } from "../services/cloudinary.service.js";

const createPost = asyncWrapper(async (req, res) => {
  const campId = req.params.campId;
  if (!campId) throw new ApiError("Camp ID is required", 400);

  const { content } = req.body;
  if (!content || content.trim() === "")
    throw new ApiError("Post content is required", 400);

  const camp = await Camp.findById(campId).select("status").lean();
  if (!camp) throw new ApiError("Camp not found", 404);
  if (camp.status === "expired")
    throw new ApiError("Camp is expired and no longer accepts posts", 403);

  const user = await User.findById(req.userId).select("camps").lean();
  const joined = user.camps.some((id) => id.toString() === campId);
  if (!joined) throw new ApiError("Join camp to create post", 403);

  const userPosted = await Post.exists({
    campId,
    userId: req.userId,
    createdAt: {
      $gt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  });

  if (userPosted)
    throw new ApiError(
      "You can create only one post per camp every 24 hours",
      429,
    );

  const image = req?.file;
  const images = [];
  if (image) {
    const uploaded = await uploadImage(image.path, "post");
    if (uploaded) {
      images.push({ id: uploaded.id, url: uploaded.url });
    }
  }

  const post = new Post({
    campId,
    userId: req.userId,
    content,
    images,
  });

  await post.save();

  addLog(campId, "Post");

  const data = await post.populate("userId", "name username");
  sendResponse(res, 201, "Post created", data);
});

const getPosts = asyncWrapper(async (req, res) => {
  const campId = req.params.campId;
  if (!campId) throw new ApiError("Camp ID is required", 400);

  const camp = await Camp.findById(campId)
    .select("status burnAt title description totalUsers")
    .lean();
  if (!camp) throw new ApiError("Camp not found", 404);
  if (camp.status === "expired") throw new ApiError("Camp expired", 403);

  const limit = 10;
  const cursor = req.body?.cursor;

  let query = {
    campId,
    deleted: false,
  };

  if (cursor) {
    query.$or = [
      { createdAt: { $lt: cursor.createdAt } },
      { createdAt: cursor.createdAt, _id: { $lt: cursor._id } },
    ];
  }

  const posts = await Post.find(query)
    .populate("userId", "name username")
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit);

  const nextCursor =
    posts.length > 0
      ? {
          createdAt: posts[posts.length - 1].createdAt,
          _id: posts[posts.length - 1]._id,
        }
      : null;

  sendResponse(res, 200, "Posts fetched", {
    camp,
    posts,
    cursor: nextCursor,
  });
});

const editPost = asyncWrapper(async (req, res) => {
  const postId = req.params.postId;
  if (!postId) throw new ApiError("Post ID is required", 400);

  const post = await Post.findById(postId).select(
    "campId userId content deleted",
  );
  if (!post) throw new ApiError("Post not found", 404);

  if (post.deleted) throw new ApiError("Deleted post cannot be edited", 409);

  if (post.userId.toString() !== req.userId)
    throw new ApiError("Only post owner can edit", 403);

  const camp = await Camp.findById(post.campId).select("status").lean();
  if (!camp) throw new ApiError("Camp not found", 404);

  if (camp.status === "expired")
    throw new ApiError("Camp is locked and cannot be modified", 403);

  const { content } = req.body;
  if (!content || !content.trim())
    throw new ApiError("Post content is required", 400);

  post.content = content;
  await post.save();

  const data = await post.populate("userId", "name username");
  sendResponse(res, 200, "Post edited", data);
});

const deletePost = asyncWrapper(async (req, res) => {
  const postId = req.params.postId;
  if (!postId) throw new ApiError("Post ID is required", 400);

  const post = await Post.findById(postId).select("campId userId deleted");
  if (!post) throw new ApiError("Post not found", 404);
  if (post.deleted) throw new ApiError("Post already deleted", 409);

  if (post.userId.toString() !== req.userId)
    throw new ApiError("Only post owner can delete", 403);

  const camp = await Camp.findById(post.campId).select("status").lean();
  if (!camp) throw new ApiError("Camp not found", 404);

  if (camp.status === "expired")
    throw new ApiError("Camp is locked and cannot be modified", 403);

  post.deleted = true;
  await post.save();

  await Message.deleteMany({ postId: post._id });

  sendResponse(res, 200, "Post deleted");
});

export { createPost, getPosts, editPost, deletePost };
