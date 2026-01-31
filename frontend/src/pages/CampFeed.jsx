import { useContext } from "react";
import FeedHeader from "../components/FeedHeader";
import FloatingCreateButton from "../components/FloatingCreateButton";
import CreatePostModal from "../components/CreatePostModal";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import { CampContext } from "../context/authContext";

const CampFeed = () => {
  const { id } = useParams();

  const { setOpen, posts } = useContext(CampContext);

  return (
    <main className="min-h-screen w-full flex flex-col items-center pb-32">
      <div className="w-full max-w-3xl">
        <FeedHeader />
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-[#a3a3a3] mt-10">
          No posts yet. Be the first one 👀
        </p>
      ) : (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      )}

      <FloatingCreateButton />

      <CreatePostModal id={id} onClose={() => setOpen(false)} />
    </main>
  );
};

export default CampFeed;
