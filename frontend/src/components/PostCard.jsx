import { useContext, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { handleError, handleSuccess } from "../notify/Notification";
import { useNavigate } from "react-router-dom";
import { AuthContext, CampContext } from "../context/authContext";

const PostCard = ({ post, campId }) => {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const { loading, setLoading } = useContext(AuthContext);
  const { posts, setPosts } = useContext(CampContext);

  const handleEditPost = async () => {
    if (!editedContent.trim()) {
      handleError("Content cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKNED_URL}/api/v1/post/edit/${post._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: editedContent }),
          credentials: "include",
        },
      );
      const result = await response.json();
      if (result.success) {
        handleSuccess(result.message);
        setPosts((prev) =>
          prev.map((p) =>
            p._id === post._id ? { ...p, content: result.data.content } : p,
          ),
        );
        setIsEditing(false);
        setActive(false);
      } else {
        handleError(result.message);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKNED_URL}/api/v1/post/delete/${post._id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      const result = await response.json();
      if (result.success) {
        handleSuccess(result.message);
        setPosts(posts.filter((p) => p._id !== post._id));
      } else {
        handleError(result.message);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="bg-surface border border-border rounded-2xl px-4 py-4 sm:px-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-accent text-black flex items-center justify-center font-semibold shrink-0">
            {post.userId?.name?.[0]}
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-text-primary truncate">
              {post.userId?.name}
            </p>
            <p className="text-sm text-text-muted truncate">
              @{post.userId?.username}
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setActive((v) => !v)}
            className="p-2 rounded-full hover:bg-bg transition"
          >
            <FiMoreHorizontal />
          </button>

          {active && (
            <div className="absolute right-0 mt-2 w-36 bg-bg border border-border rounded-xl shadow-lg z-50">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setActive(false);
                }}
                disabled={loading}
                className="w-full px-4 py-2 text-left text-sm hover:bg-surface transition rounded-t-xl"
              >
                Edit
              </button>
              <button
                onClick={handleDeletePost}
                disabled={loading}
                className="w-full px-4 py-2 text-left text-sm hover:bg-surface transition rounded-b-xl"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3 mb-3">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-xl bg-bg border border-border p-3 text-sm outline-none"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedContent(post.content);
              }}
              className="px-4 py-2 rounded-xl border border-border text-text-primary"
            >
              Cancel
            </button>
            <button
              onClick={handleEditPost}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-accent text-black font-semibold disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm sm:text-[15px] leading-relaxed mb-3 whitespace-pre-wrap break-words text-text-primary">
          {post.content}
        </p>
      )}

      {post.images?.length > 0 && (
        <div className="mt-2 mb-4">
          <img
            src={post.images[0].url}
            alt="post"
            className="w-full max-h-80 object-cover rounded-xl"
          />
        </div>
      )}

      <div className="flex items-center justify-between text-xs sm:text-sm text-text-muted">
        <span>{new Date(post.createdAt).toLocaleString()}</span>
        <button
          onClick={() => navigate(`/camp-feed/${campId}/post/${post._id}`)}
          className="hover:text-text-primary transition"
        >
          Open discussion
        </button>
      </div>
    </article>
  );
};

export default PostCard;
