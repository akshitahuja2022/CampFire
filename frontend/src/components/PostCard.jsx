import { FiMoreHorizontal } from "react-icons/fi";

const PostCard = ({ post }) => {
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

        <button className="p-2 rounded-full hover:bg-[#18181b] shrink-0">
          <FiMoreHorizontal />
        </button>
      </div>

      <p className="text-sm sm:text-[15px] leading-relaxed mb-3 whitespace-pre-wrap break-words">
        {post.content}
      </p>

      {post.images?.length > 0 && (
        <img
          src={post.images[0].url}
          alt="post"
          className="w-full max-h-64 sm:max-h-80 md:max-h-[420px] object-cover rounded-lg mb-3"
        />
      )}

      <div className="text-xs text-[#a3a3a3]">
        {new Date(post.createdAt).toLocaleString()}
      </div>
    </article>
  );
};

export default PostCard;
