import { useContext, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { Link } from "react-router-dom";
import { AuthContext, CampContext } from "../context/authContext";
import { handleError, handleSuccess } from "../notify/Notification";

const PostCard = ({ post }) => {
  const [active, setActive] = useState(false);

  const { loading, setLoading } = useContext(AuthContext);
  const { posts, setPosts } = useContext(CampContext);

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
    <article
      className="w-full max-w-full sm:max-w-xl md:max-w-2xl xl:max-w-3xl bg-[#0f0f11] border border-[#1f1f23] rounded-xl p-3 sm:p-4  md:p-5mx-auto
      "
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-orange-400 text-black flex items-center justify-center font-semibold shrink-0">
            {post.userId?.name?.[0]}
          </div>

          <div className="min-w-0">
            <p className="font-semibold leading-tight truncate">
              {post.userId?.name}
            </p>
            <p className="text-sm text-[#a3a3a3] truncate">
              @{post.userId?.username}
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setActive(!active)}
            className="p-2 rounded-full hover:bg-[#18181b] shrink-0"
          >
            <FiMoreHorizontal />
          </button>
          {active && (
            <div className="absolute right-0 mt-2 w-40 bg-[#1f1f23] rounded-md shadow-lg z-50">
              <div className="px-2 py-2 space-y-1">
                <Link className="text-white hover:bg-orange-400 hover:text-black block px-3 py-2 rounded-md text-base font-medium">
                  Edit Post
                </Link>
                <button
                  onClick={handleDeletePost}
                  disabled={loading}
                  className={`text-white hover:bg-orange-400 hover:text-black block px-3 py-2 rounded-md text-base font-medium ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Delete Post
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm sm:text-[15px] leading-relaxed mb-3 whitespace-pre-wrap break-words">
        {post.content}
      </p>

      {post.images?.length > 0 && (
        <img
          src={post.images[0].url}
          alt="post"
          className="w-full md:max-w-96 mx-auto max-h-64 sm:max-h-64 md:max-h-80 object-center rounded-lg mb-3"
        />
      )}

      <div className="text-xs text-[#a3a3a3]">
        {new Date(post.createdAt).toLocaleString()}
      </div>
    </article>
  );
};

export default PostCard;
