import Message from "../models/message.model.js";
import Post from "../models/post.model.js";
import ApiError from "../utils/ApiError.util.js";

const addMessage = async (userId, postId, text) => {
  const post = await Post.findById(postId).select("deleted campId").lean();
  if (!post) throw new ApiError("Post not exists", 400);
  if (post.deleted) throw new ApiError("Post is deleted", 400);

  const message = new Message({
    userId,
    postId,
    content: text,
    campId: post.campId,
  });
  await message.save();

  return message;
};

export { addMessage };
