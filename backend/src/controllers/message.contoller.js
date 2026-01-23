import Message from "../models/message.model.js";
import Post from "../models/post.model.js";
import ApiError from "../utils/ApiError.util.js";
import asyncWrapper from "../utils/asyncWrapper.util.js";
import sendResponse from "../utils/sendResponse.util.js";
import addLog from "../utils/log.util.js";

const addMessage = async (userId, campId, postId, text) => {
  const post = await Post.findById(postId).select("deleted campId").lean();
  if (!post) throw new ApiError("Post not exists", 400);
  if (post.deleted) throw new ApiError("Post is deleted", 400);

  const message = new Message({
    userId,
    campId,
    postId,
    content: text,
    campId: post.campId,
  });
  await message.save();
  const data = await message.populate("userId", "name username");

  addLog(post.campId, "Message");

  return data;
};

const editMessage = async (userId, messageId, text) => {
  const message = await Message.findById(messageId).select(
    "userId postId content",
  );
  if (!message) throw new ApiError("Message not found");
  if (message.userId.toString() !== userId)
    throw new ApiError("Only owner can edit", 400);

  const post = await Post.findById(message.postId).select("deleted").lean();
  if (post.deleted) throw new ApiError("Post is deleted", 400);

  message.content = text;
  await message.save();

  return message;
};

const deleteMessage = async (userId, messageId) => {
  const message = await Message.findById(messageId)
    .select("userId postId")
    .lean();
  if (!message) throw new ApiError("Message not found");
  if (message.userId.toString() !== userId)
    throw new ApiError("Only owner can delete", 400);

  const post = await Post.findById(message.postId).select("deleted").lean();
  if (post.deleted) throw new ApiError("Post is deleted", 400);

  await Message.findByIdAndDelete(message._id);

  return true;
};

const getMessages = asyncWrapper(async (req, res) => {
  const postId = req.params.postId;

  const post = await Post.findById(postId).select("deleted").lean();
  if (!post) throw new ApiError("Post not found", 404);
  if (post.deleted) throw new ApiError("Post is deleted", 400);

  const cursor = req.body?.cursor;
  if (cursor === null) return sendResponse(res, 200, "No more messages");

  let query = {
    postId,
  };

  if (cursor) {
    query.$or = [
      { createdAt: { $lt: cursor.createdAt } },
      { createdAt: cursor.createdAt, _id: { $lt: cursor._id } },
    ];
  }

  const messages = await Message.find(query)
    .populate("userId", "name username")
    .sort({ createdAt: -1 })
    .limit(10);

  const nextCursor =
    messages.length > 0
      ? {
          createdAt: messages[messages.length - 1].createdAt,
          _id: messages[messages.length - 1]._id,
        }
      : null;

  sendResponse(res, 200, "Message fetched!", {
    messages,
    cursor: nextCursor,
    me: req.userId,
  });
});

export { addMessage, editMessage, deleteMessage, getMessages };
