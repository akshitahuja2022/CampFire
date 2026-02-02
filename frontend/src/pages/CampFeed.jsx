import { useContext, useEffect } from "react";
import FeedHeader from "../components/FeedHeader";
import FloatingCreateButton from "../components/FloatingCreateButton";
import CreatePostModal from "../components/CreatePostModal";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import { CampContext } from "../context/authContext";
import { socket } from "../utils/socket";

const CampFeed = () => {
  const { id } = useParams();

  const { posts, messagesByPost, setMessagesByPost } = useContext(CampContext);

  useEffect(() => {
    if (!posts.length) return;
    socket.connect();

    posts.forEach((post) => {
      socket.emit("joinPost", post._id);
    });

    socket.on("message", ({ message }) => {
      setMessagesByPost((prev) => ({
        ...prev,
        [message.postId]: [message, ...(prev[message.postId] || [])],
      }));
    });

    socket.on("edit-message", ({ update }) => {
      setMessagesByPost((prev) => ({
        ...prev,
        [update.postId]: prev[update.postId]?.map((m) =>
          m._id === update._id ? update : m,
        ),
      }));
    });

    socket.on("delete-message", ({ messageId, postId }) => {
      setMessagesByPost((prev) => ({
        ...prev,
        [postId]: prev[postId]?.filter((m) => m._id !== messageId),
      }));
    });

    return () => {
      socket.off("message");
      socket.off("edit-message");
      socket.off("delete-message");
      socket.disconnect();
    };
  }, [posts, setMessagesByPost]);

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
        posts.map((post) => (
          <PostCard
            campId={id}
            key={post._id}
            post={post}
            messagesByPost={messagesByPost[post._id] || []}
          />
        ))
      )}

      {/* <FloatingCreateButton /> */}

      <CreatePostModal id={id} />
    </main>
  );
};

export default CampFeed;
