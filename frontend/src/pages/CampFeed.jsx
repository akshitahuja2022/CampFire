import { useContext } from "react";
import FeedHeader from "../components/FeedHeader";
import FloatingCreateButton from "../components/FloatingCreateButton";
import CreatePostModal from "../components/CreatePostModal";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import { CampContext } from "../context/authContext";

const CampFeed = () => {
  const { id } = useParams();
  const { posts } = useContext(CampContext);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-3xl px-2 sm:px-0">
        <FeedHeader />
      </div>

      <div className="w-full max-w-3xl flex flex-col gap-3 px-2 sm:px-0 pb-24">
        {posts.length === 0 ? (
          <p className="text-center text-text-muted mt-10">
            No posts yet. Be the first one 👀
          </p>
        ) : (
          posts.map((post) => (
            <PostCard key={post._id} campId={id} post={post} />
          ))
        )}
      </div>

      <FloatingCreateButton />
      <CreatePostModal id={id} />
    </div>
  );
};

export default CampFeed;
